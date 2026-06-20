import { Router } from 'express';
import * as portalController from '../controllers/portalController';
import { authenticateToken, authenticateRoles } from '../middlewares/authMiddleware';

const router = Router();

// Rute Publik (Akses Tanpa Login)
// Endpoint: GET /api/portal/beranda
router.get('/beranda', portalController.getBerandaStats);

// Endpoint: GET /api/portal/informasi
router.get('/informasi', portalController.getInformasiJadwal);

// Rute Terproteksi (Akses Akun Login Mahasiswa/Calon Mahasiswa)
// Endpoint: GET /api/portal/status
router.get('/status', authenticateToken, portalController.getStatusSeleksi);

// Rute Terproteksi Admin (Khusus Admin untuk Mengubah Status Pendaftaran Calon Mahasiswa)
// Endpoint: PUT /api/portal/admin/status/:userId
router.put(
  '/admin/status/:userId',
  authenticateToken,
  authenticateRoles('admin'),
  portalController.updateStatusSeleksi
);

export default router;
