import { Request, Response } from 'express';
import knex from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../knexfile';

const db = knex(config.development);

// Fungsi register
export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const {
      nama_lengkap,
      nik,
      nomor_wa,
      email,
      password,
      konfirmasi_password,
    } = req.body;

    // Wadah penampung validasi error
    const errors: Record<string, string> = {};

    // ==========================================
    // VALIDASI INPUT DARI FRONTEND
    // ==========================================

    // Validasi nama lengkap
    if (
      !nama_lengkap ||
      typeof nama_lengkap !== 'string' ||
      nama_lengkap.trim() === ''
    ) {
      errors.nama_lengkap =
        'Nama lengkap wajib diisi dengan format teks yang benar.';
    }

    // Validasi NIK
    if (!nik) {
      errors.nik = 'NIK wajib diisi.';
    } else {
      const numericRegex = /^[0-9]+$/;
      if (nik.length !== 16 || !numericRegex.test(nik)) {
        errors.nik = 'NIK harus berisi tepat 16 digit.';
      }
    }

    // Validasi Nomor WhatsApp
    if (!nomor_wa || typeof nomor_wa !== 'string' || nomor_wa.trim() === '') {
      errors.nomor_wa = 'Nomor WhatsApp wajib diisi.';
    }

    // Validasi Email
    if (!email) {
      errors.email = 'Email wajib diisi.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Format email tidak valid.';
      }
    }

    // Validasi Password
    if (!password || password.length < 6) {
      errors.password = 'Password wajib diisi dan minimal harus 6 karakter.';
    }

    // Validasi Konfirmasi Password
    if (!konfirmasi_password) {
      errors.konfirmasi_password = 'Konfirmasi password wajib diisi.';
    } else if (password !== konfirmasi_password) {
      errors.konfirmasi_password =
        'Konfirmasi password tidak cocok dengan password utama!';
    }

    // JIKA ADA ERROR VALIDASI: Stop proses, langsung kembalikan daftar error
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validasi pendaftaran akun gagal! Periksa kembali data Anda.',
        errors: errors,
      });
    }

    // Pengecekan apakah email sudah terdaftar di database
    const userExist = await db('users').where({ email }).first();
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: 'Validasi pendaftaran akun gagal.',
        errors: { email: 'Email sudah terdaftar, gunakan email lain.' },
      });
    }

    // Pengecekan apakah nik sudah terdaftar di database
    const nikExist = await db('users').where({ nik }).first();
    if (nikExist) {
      return res.status(409).json({
        success: false,
        message: 'Validasi pendaftaran akun gagal.',
        errors: { nik: 'NIK sudah terdaftar. Harap gunakan NIK anda sendiri.' },
      });
    }

    // ==========================================
    // PROSES EKSEKUSI & PENYIMPANAN DATA
    // ==========================================

    // Amankan password menggunakan bcrypt (salt rounds 10 sesuai standar industri)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke dalam tabel 'users'
    // PostgreSQL akan otomatis men-generate UUID karena sudah set DEFAULT di migrasi
    const [insertedUser] = await db('users')
      .insert({
        nama_lengkap: nama_lengkap.trim(),
        nik,
        nomor_wa,
        email: email.toLocaleLowerCase().trim(),
        password: hashedPassword,
        role: 'student',
      })
      .returning('*');

    // Proteksi data sensitif, (jangan pulangkan password ke frontend!)
    const newUser = {
      id: insertedUser.id,
      nama_lengkap: insertedUser.nama_lengkap,
      nik: insertedUser.nik,
      nomor_wa: insertedUser.nomor_wa,
      email: insertedUser.email,
      role: insertedUser.role,
      created_at: insertedUser.created_at,
    };
    // Respon sukses ke frontend
    return res.status(201).json({
      success: true,
      message: 'Registrasi akun mahasiswa berhasil!',
      data: newUser,
    });
  } catch (error) {
    console.error('Error saat register:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server internal.',
    });
  }
}

// Fungsi Login
export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!',
      });
    }

    // Cari user berdasarkan email di database PostgreSQL
    const user = await db('users').where({ email }).first();

    // Jika tidak ditemukan, kirim respon salah 401 Unauthorized
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang anda masukkan salah!',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password yang anda masukkan salah!',
      });
    }

    // Jika sukses, buat JWT Token (berlaku selama 1 hari / 24 jam)
    // masukkan data ID dan Role ke dalam token agar Frontend bisa memanfaatkannya
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: '24h' },
    );

    // Kirim respon sukses beserta token ke frontend
    return res.status(200).json({
      success: true,
      message: 'Login berhasil. Selamat datang kembali',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server internal.',
    });
  }
}
