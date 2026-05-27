const { sequelize } = require('../../config/database');
const { FeeInvoice, FeePayment, Wallet, AttendanceRecord, Student, Staff } = require('../../models');

// @desc    Get Financial Analytics for Dashboards
// @route   GET /api/dashboard/finance
// @access  Protected
const getFinanceAnalytics = async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    // 1. Total Revenue (Sum of all successful Fee Payments)
    const totalRevenueResult = await FeePayment.sum('amount', {
      where: { school_id: schoolId }
    });

    // 2. Outstanding Debt (Sum of unpaid amounts on Invoices)
    const [debtResult] = await sequelize.query(`
      SELECT SUM(total_amount - paid_amount) as outstanding_debt 
      FROM fee_invoices 
      WHERE school_id = :schoolId AND status IN ('Pending', 'Partial', 'Overdue')
    `, {
      replacements: { schoolId },
      type: sequelize.QueryTypes.SELECT
    });

    // 3. Total Money in Campus Wallets
    const totalWalletBalance = await Wallet.sum('balance', {
      where: { school_id: schoolId, status: 'Active' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        total_revenue: totalRevenueResult || 0,
        outstanding_debt: debtResult.outstanding_debt || 0,
        total_wallet_circulation: totalWalletBalance || 0
      }
    });

  } catch (error) {
    console.error('Finance Analytics Error:', error);
    res.status(500).json({ message: 'Server error retrieving analytics' });
  }
};

// @desc    Get General KPI Analytics for Dashboards
// @route   GET /api/dashboard/kpis
// @access  Protected
const getGeneralKPIs = async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    // Fast parallel queries for KPI counts
    const [studentCount, staffCount, presentToday] = await Promise.all([
      Student.count({ where: { school_id: schoolId, status: 'Active' } }),
      Staff.count({ where: { school_id: schoolId, status: 'Active' } }),
      
      // Simulate today's attendance count (Assuming we have a session or timestamp logic)
      // For demonstration, just counting all 'present' records
      AttendanceRecord.count({
        include: [{
           model: Student, 
           as: 'student', 
           where: { school_id: schoolId } 
        }],
        where: { status: 'present' } 
      })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total_students: studentCount,
        total_staff: staffCount,
        attendance_today: presentToday // Needs refinement with dates in production
      }
    });

  } catch (error) {
    console.error('KPI Analytics Error:', error);
    res.status(500).json({ message: 'Server error retrieving KPIs' });
  }
};

module.exports = {
  getFinanceAnalytics,
  getGeneralKPIs
};
