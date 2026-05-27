const express = require('express');
const router = express.Router();
const { handlePaymentWebhook } = require('../controllers/finance/webhookController');

// This route is PUBLIC so that MTN/PayPack can reach it,
// but inside the controller, it verifies a cryptographic signature.
router.post('/payment', handlePaymentWebhook);

module.exports = router;
