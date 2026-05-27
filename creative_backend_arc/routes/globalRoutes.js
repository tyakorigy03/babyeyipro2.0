const express = require('express');
const router = express.Router();
const { onboardSchool, registerAgent } = require('../controllers/global/superAdminController');
const { processProxyPayment, updateDeliveryStatus } = require('../controllers/global/agentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// === SUPER ADMIN ROUTES (Platform Operations) ===
// In a real scenario, restrictTo('SuperAdmin') would be used here.
router.post('/schools/onboard', onboardSchool);
router.post('/agents/register', registerAgent);

// === AGENCY ROUTES (Agent Operations) ===
router.post('/agency/proxy-payment', protect, processProxyPayment);
router.patch('/agency/delivery/:orderId', protect, updateDeliveryStatus);

module.exports = router;
