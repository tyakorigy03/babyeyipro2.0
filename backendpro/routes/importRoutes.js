const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { bulkImport } = require('../controllers/core/importController');
const { protect } = require('../middleware/authMiddleware');

// The route expects a multipart/form-data request with a file field named 'csv_file'
router.post('/:resource', protect, upload.single('csv_file'), bulkImport);

module.exports = router;
