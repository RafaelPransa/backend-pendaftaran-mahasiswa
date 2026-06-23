import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticateToken, authenticateRoles } from '../middlewares/authMiddleware';

const router = Router();

// Proteksi rute admin: Semua rute di bawah router ini wajib Login (authenticateToken) dan ber-Role Admin.
router.use(authenticateToken, authenticateRoles('admin'));

// =========================================================================
// FEATURE 3: CRUD Program Studi
// =========================================================================
router.get('/prodi', adminController.ambilSemuaProdi);
router.get('/prodi/:id', adminController.ambilDetailProdi);
router.post('/prodi', adminController.tambahProdi);
router.put('/prodi/:id', adminController.ubahProdi);
router.delete('/prodi/:id', adminController.hapusProdi);

// =========================================================================
// FEATURE 4: CRUD Pengumuman
// =========================================================================
router.get('/pengumuman', adminController.ambilSemuaPengumuman);
router.get('/pengumuman/:id', adminController.ambilDetailPengumuman);
router.post('/pengumuman', adminController.tambahPengumuman);
router.put('/pengumuman/:id', adminController.ubahPengumuman);
router.delete('/pengumuman/:id', adminController.hapusPengumuman);

// =========================================================================
// FEATURE 5: Persetujuan KRS (KRS Approval)
// =========================================================================
router.get('/krs/ajuan', adminController.ambilAjuanKrs);
router.get('/krs/ajuan/:userId', adminController.ambilDetailAjuanKrs);
router.put('/krs/ajuan/:userId', adminController.verifikasiKrs);

export default router;
