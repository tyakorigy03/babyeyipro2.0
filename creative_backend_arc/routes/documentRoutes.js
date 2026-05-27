const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { uploadDocument } = require('../controllers/core/documentController');
const { protect } = require('../middleware/authMiddleware');

// The route expects a multipart/form-data request with a field named 'document' containing the file
router.post('/upload', protect, upload.single('document'), uploadDocument);

module.exports = router;
