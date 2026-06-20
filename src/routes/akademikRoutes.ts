import { Router } from 'express';
import * as akademikController from '../controllers/akademikController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: GET /api/akademik/dashboard
router.get('/dashboard', authenticateToken, akademikController.getDashboard);

export default router;
