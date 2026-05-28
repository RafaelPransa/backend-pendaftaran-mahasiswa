const knex = require('../../knexfile'); // Panggil konfigurasi knex
// Inisialisasi knex menggunakan konfigurasi developmentnya
const db = require('knex')(knex.development);
const bcrypt = require('bcrypt');

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
