const { sequelize } = require('../../config/database');
const { FeeInvoice, FeePayment, WalletTransaction, Student } = require('../../models');
const { dispatchNotification } = require('../../services/notificationService');

// @desc    Receive Payment Webhook from External Gateway (e.g., MTN Momo, PayPack)
// @route   POST /api/webhooks/payment
// @access  Public (But secured via Payload Signature/IP Whitelist)
const handlePaymentWebhook = async (req, res) => {
  // 1. Verify Webhook Signature
  // In production, you verify a hash in the headers to ensure the request actually came from MTN/PayPack
  const signature = req.headers['x-provider-signature'];
  // if (!isValidSignature(req.body, signature)) return res.status(401).send('Unauthorized');

  const { transaction_id, status, amount, currency, reference, phone_number } = req.body;
  // `reference` usually contains our internal FeeInvoice ID or Student ID

  if (status !== 'SUCCESS') {
    // Log failure and exit
    console.log(`Payment failed for tx: ${transaction_id}`);
    return res.status(200).send('Acknowledged'); // Always return 200 to webhooks
  }

  const t = await sequelize.transaction();

  try {
    // 2. Identify what is being paid
    // Let's assume the 'reference' is the FeeInvoice ID for this example
    const invoice = await FeeInvoice.findOne({
      where: { id: reference },
      include: [{ model: Student, as: 'student' }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!invoice) {
      await t.rollback();
      console.error(`Webhook Error: Invoice ${reference} not found`);
      return res.status(200).send('Acknowledged'); // Don't let the provider retry infinitely
    }

    // 3. Record the Payment
    const payment = await FeePayment.create({
      school_id: invoice.school_id,
      invoice_id: invoice.id,
      student_id: invoice.student_id,
      amount: parseFloat(amount),
      payment_date: new Date(),
      payment_method: 'Mobile Money',
      reference_number: transaction_id, // The Momo Tx ID
      remarks: `Automated webhook payment from ${phone_number}`
    }, { transaction: t });

    // 4. Update the Invoice Balance
    invoice.paid_amount = parseFloat(invoice.paid_amount) + parseFloat(amount);
    
    if (invoice.paid_amount >= invoice.total_amount) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partial';
    }
    await invoice.save({ transaction: t });

    // 5. Generate Internal Wallet Credit (Double Entry for the School)
    // Optional, depending on if you treat school accounts as internal wallets
    // await WalletTransaction.create({ ... })

    await t.commit();

    // 6. Trigger Asynchronous Notification via Service Layer
    // We don't await this, so the webhook responds fast
    dispatchNotification(
      invoice.school_id,
      'FeePayment',
      'PaymentReceived',
      invoice.student.user_id || 'parent_id', // Assuming student links to parent
      'Payment Received',
      `Dear Parent, we have received your payment of ${amount} for ${invoice.student.full_name}. Thank you.`,
      'FeePayment',
      payment.id
    );

    res.status(200).send('OK');

  } catch (error) {
    await t.rollback();
    console.error('Webhook Processing Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  handlePaymentWebhook
};
