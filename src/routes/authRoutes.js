const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  authenticateToken,
  authenticateRoles,
} = require('../middlewares/authMiddleware');

// Rute Umum (Siapa saja bisa akses tanpa login)
// Fungsi: Menerima pendaftaran akun baru
// Endpoint: POST /api/auth/register
router.post('/register', authController.register);
// Endpoint: POST /api/auth/login
router.post('/login', authController.login);

// Rute hanya untuk simulasi pengujian middleware
// Endpoint ini hanya bisa diakses kalau user sudah LOGIN (mahasiswa & admin bisa)
router.get('/dashboard-bersama', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Selamat! Anda berhasil menembus proteksi token',
    user_log: req.user,
  });
});

// Endpoint ini KHUSUS untuk ADMIN saja
router.get(
  '/dashboard-admin',
  authenticateToken,
  authenticateRoles('admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Halo admin ganteng! Selamat datang di kontrol panel utama.',
    });
  },
);

module.exports = router;
