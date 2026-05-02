const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/communication/communicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat/send', protect, sendMessage);

module.exports = router;
