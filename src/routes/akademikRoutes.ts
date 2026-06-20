import { Router } from 'express';
import * as akademikController from '../controllers/akademikController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: GET /api/akademik/dashboard
router.get('/dashboard', authenticateToken, akademikController.getDashboard);

// Feature 2: KRS (Kartu Rencana Studi)
// Endpoint: GET /api/akademik/krs/kelas
router.get('/krs/kelas', authenticateToken, akademikController.getKelasTersedia);

// Endpoint: GET /api/akademik/krs
router.get('/krs', authenticateToken, akademikController.getKrs);

// Endpoint: POST /api/akademik/krs
router.post('/krs', authenticateToken, akademikController.simpanKrs);

// Feature 3: KHS (Kartu Hasil Studi)
// Endpoint: GET /api/akademik/khs
router.get('/khs', authenticateToken, akademikController.getKhs);

// Feature 4: Transkrip Nilai
// Endpoint: GET /api/akademik/transkrip
router.get('/transkrip', authenticateToken, akademikController.getTranskrip);

// Feature 5: Keuangan (Tagihan UKT)
// Endpoint: GET /api/akademik/keuangan
router.get('/keuangan', authenticateToken, akademikController.getKeuangan);

// Endpoint: POST /api/akademik/keuangan/bayar
router.post('/keuangan/bayar', authenticateToken, akademikController.bayarUkt);

// Feature 6: Forum Diskusi
// Endpoint: POST /api/akademik/forum/threads
router.post('/forum/threads', authenticateToken, akademikController.buatThread);

// Endpoint: GET /api/akademik/forum/threads
router.get('/forum/threads', authenticateToken, akademikController.ambilSemuaThread);

// Endpoint: GET /api/akademik/forum/threads/:id
router.get('/forum/threads/:id', authenticateToken, akademikController.ambilDetailThread);

// Endpoint: POST /api/akademik/forum/threads/:id/replies
router.post('/forum/threads/:id/replies', authenticateToken, akademikController.buatBalasan);

export default router;
