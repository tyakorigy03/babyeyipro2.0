const express = require('express');
const router = express.Router();
const { executePromotionJob } = require('../controllers/academic/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Execute Promotion Job (Protected and might require specific RBAC in production)
router.post('/enrollments/promote', protect, executePromotionJob);

module.exports = router;
