import { Router, Request, Response } from 'express';
import * as authController from '../controllers/authController';
import {
  authenticateToken,
  authenticateRoles,
} from '../middlewares/authMiddleware';

const router = Router();

// Rute Umum (Siapa saja bisa akses tanpa login)
// Fungsi: Menerima pendaftaran akun baru
// Endpoint: POST /api/auth/register
router.post('/register', authController.register);
// Endpoint: POST /api/auth/login
router.post('/login', authController.login);

// Rute hanya untuk simulasi pengujian middleware
// Endpoint ini hanya bisa diakses kalau user sudah LOGIN (mahasiswa & admin bisa)
router.get('/dashboard-bersama', authenticateToken, (req: Request, res: Response) => {
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
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Halo admin ganteng! Selamat datang di kontrol panel utama.',
    });
  },
);

export default router;
