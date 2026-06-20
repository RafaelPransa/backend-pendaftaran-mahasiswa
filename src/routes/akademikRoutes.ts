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

export default router;
