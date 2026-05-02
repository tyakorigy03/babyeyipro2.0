const cron = require('node-cron');
const { FeeInvoice, FeePayment, Student, School, sequelize } = require('../models');
const { Op } = require('sequelize');

// --- Scheduled Jobs ---

// 1. Midnight Finance Sweep: Check for Overdue Invoices
// Runs every day at 23:59 (Midnight)
cron.schedule('59 23 * * *', async () => {
  console.log('[CRON] Starting Midnight Finance Sweep...');
  try {
    const today = new Date();
    
    // Find all unpaid or partially paid invoices whose due date has passed
    const [updatedCount] = await FeeInvoice.update(
      { status: 'Overdue' },
      {
        where: {
          due_date: { [Op.lt]: today },
          status: { [Op.in]: ['Pending', 'Partial'] }
        }
      }
    );

    console.log(`[CRON] Midnight Finance Sweep Complete. Marked ${updatedCount} invoices as Overdue.`);
    
    // Optional: We could loop through these and trigger the notificationService to alert parents.

  } catch (error) {
    console.error('[CRON] Error in Midnight Finance Sweep:', error);
  }
});

// 2. Add more jobs here (e.g., Attendance Absences, Payroll Generation)

console.log('[CRON] Automation Engine Initialized and Scheduled.');
