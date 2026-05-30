const express = require('express');
const router = express.Router();
const biodataController = require('../controllers/biodataController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint: POST api/biodata
router.post('/biodata', authenticateToken, biodataController.isiBiodata);

module.exports = router;
