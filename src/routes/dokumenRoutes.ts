import { Router } from 'express';
import * as dokumenController from '../controllers/dokumenController';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

// Endpoint: POST /api/dokumen
// Pengecekan: JWT terus ke Multer menangkap 4 field file
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'ktp', maxCount: 1 },
    { name: 'kartu_keluarga', maxCount: 1 },
    { name: 'ijazah_skl', maxCount: 1 },
    { name: 'pas_foto', maxCount: 1 },
  ]),
  dokumenController.uploadBerkas,
);

export default router;
