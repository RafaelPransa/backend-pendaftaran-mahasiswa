import { Router } from 'express';
import * as portalController from '../controllers/portalController';
import { authenticateToken, authenticateRoles } from '../middlewares/authMiddleware';

const router = Router();

// Rute Publik (Akses Tanpa Login)
// Endpoint: GET /api/portal/beranda
router.get('/beranda', portalController.getBerandaStats);

// Endpoint: GET /api/portal/informasi
router.get('/informasi', portalController.getInformasiJadwal);

// Endpoint: GET /api/portal/status
router.get('/status', authenticateToken, portalController.getStatusSeleksi);

// Endpoint: GET /api/portal/pengumuman
router.get('/pengumuman', authenticateToken, portalController.getPortalPengumuman);

// Endpoint: GET /api/portal/pengumuman/:id
router.get('/pengumuman/:id', authenticateToken, portalController.getPortalPengumumanDetail);

// Rute Terproteksi Admin (Khusus Admin untuk Mengubah Status Pendaftaran Calon Mahasiswa)
// Endpoint: PUT /api/portal/admin/status/:userId
router.put(
  '/admin/status/:userId',
  authenticateToken,
  authenticateRoles('staf administration'),
  portalController.updateStatusSeleksi
);

export default router;
