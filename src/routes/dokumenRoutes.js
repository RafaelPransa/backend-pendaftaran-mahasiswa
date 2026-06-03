const express = require('express');
const router = express.Router();
const dokumenController = require('../controllers/dokumenController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

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

module.exports = router;
