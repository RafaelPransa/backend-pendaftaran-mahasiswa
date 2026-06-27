import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticateToken, authenticateRoles } from '../middlewares/authMiddleware';

const router = Router();

// Proteksi rute admin: Semua rute di bawah router ini wajib Login (authenticateToken) dan ber-Role Staf Administrasi.
router.use(authenticateToken, authenticateRoles('staf administration'));

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

// =========================================================================
// FEATURE 7: Dashboard Statistik Admin & Tren
// =========================================================================
router.get('/dashboard', adminController.ambilStatistikDashboard);
router.get('/laporan/pmb', adminController.ambilTrenPendaftaran);

// =========================================================================
// FEATURE 6: Verifikasi Dokumen Per Berkas
// =========================================================================
router.get('/dokumen', adminController.ambilSemuaDokumen);
router.put('/dokumen/:userId/verify', adminController.verifikasiDokumen);

// =========================================================================
// FEATURE 8: Pengelolaan Pendaftar (List, Detail, Status, Export CSV)
// =========================================================================
router.get('/pendaftar', adminController.ambilSemuaPendaftar);
router.get('/pendaftar/export', adminController.eksporPendaftarCsv);
router.get('/pendaftar/:userId', adminController.ambilDetailPendaftar);
router.put('/pendaftar/:userId/status', adminController.ubahStatusKelulusanPendaftar);

// =========================================================================
// FEATURE 9: Reset Kata Sandi Staff
// =========================================================================
router.post('/staff/reset-password', adminController.resetPasswordStaff);

// =========================================================================
// FEATURE 10: Verifikasi Keuangan & Registrasi Ulang (NIM Generator)
// =========================================================================
router.get('/keuangan', adminController.ambilAjuanKeuangan);
router.put('/keuangan/:keuanganId/verifikasi', adminController.verifikasiKeuangan);

export default router;
