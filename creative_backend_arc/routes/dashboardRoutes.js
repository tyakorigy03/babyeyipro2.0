const express = require('express');
const router = express.Router();
const { getFinanceAnalytics, getGeneralKPIs } = require('../controllers/core/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/finance', getFinanceAnalytics);
router.get('/kpis', getGeneralKPIs);

module.exports = router;
