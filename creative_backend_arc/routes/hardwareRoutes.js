const express = require('express');
const router = express.Router();
const { processTap } = require('../controllers/hardware/rfidController');
const { protect } = require('../middleware/authMiddleware');
// In a real scenario, hardware routes might use API keys instead of user JWTs,
// but we'll use standard protection for this demonstration.

router.post('/rfid/tap', protect, processTap);

module.exports = router;
