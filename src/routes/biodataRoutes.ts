import { Router } from 'express';
import * as biodataController from '../controllers/biodataController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: POST api/biodata
router.post('/biodata', authenticateToken, biodataController.isiBiodata);

export default router;
