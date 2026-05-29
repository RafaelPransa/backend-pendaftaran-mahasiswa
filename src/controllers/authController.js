const knex = require('../../knexfile'); // Panggil konfigurasi knex
// Inisialisasi knex menggunakan konfigurasi developmentnya
const db = require('knex')(knex.development);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!',
      });
    }

    // Pengecekan apakah email sudah terdaftar di database
    const userExist = await db('users').where({ email }).first();
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar, gunakan email lain.',
      });
    }

    // Amankan password menggunakan bcryot (salt rounds 10 sesuai standar indrustri)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke dalam tabel 'users'
    // PostgreSQL akan otomatis men-generate UUID karena sudah set DEFAULT di migrasi
    const [insertedUser] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        role: 'student',
      })
      .returning(['*']);

    const newUser = {
      id: insertedUser.id,
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
};

// Fungsi Login
exports.login = async (req, res) => {
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
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
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
};
