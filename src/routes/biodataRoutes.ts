import { Router } from 'express';
import * as biodataController from '../controllers/biodataController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: POST api/biodata
router.post('/biodata', authenticateToken, biodataController.isiBiodata);

// Endpoint: PUT api/biodata
router.put('/biodata', authenticateToken, biodataController.ubahBiodata);

// Endpoint: GET api/biodata
router.get('/biodata', authenticateToken, biodataController.getBiodata);

// Endpoint: POST api/biodata/rapor
router.post('/rapor', authenticateToken, biodataController.isiRapor);

// Endpoint: GET api/biodata/rapor
router.get('/rapor', authenticateToken, biodataController.getRapor);

// Endpoint: GET api/biodata/prodi - Daftar program studi untuk dropdown formulir
router.get('/prodi', authenticateToken, biodataController.getProdiList);

export default router;

