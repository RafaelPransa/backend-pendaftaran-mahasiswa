import { Router } from 'express';
import * as biodataController from '../controllers/biodataController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: POST api/biodata
router.post('/biodata', authenticateToken, biodataController.isiBiodata);

// Endpoint: PUT api/biodata
router.put('/biodata', authenticateToken, biodataController.ubahBiodata);

export default router;
