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

export default router;
