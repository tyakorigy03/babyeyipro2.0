const express = require('express');
const router = express.Router();
const { processTransfer } = require('../controllers/finance/walletController');
const { protect } = require('../middleware/authMiddleware');

router.post('/wallets/transfer', protect, processTransfer);

module.exports = router;
