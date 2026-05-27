const { sequelize } = require('../../config/database');
const { Agent, AgentTransaction, FeeInvoice, FeePayment, DealOrder } = require('../../models');

// @desc    Make a Proxy Payment on behalf of a Parent
// @route   POST /api/agency/proxy-payment
// @access  Agent Only
const processProxyPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { invoice_id, amount } = req.body;
    const userId = req.user.id; // The logged-in Agent's user ID

    // 1. Find the Agent
    const agent = await Agent.findOne({ where: { user_id: userId } });
    if (!agent) {
      return res.status(403).json({ message: 'Unauthorized: Not a registered agent' });
    }

    // 2. Check Agent Wallet Balance
    if (parseFloat(agent.wallet_balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient agent wallet balance to process proxy payment' });
    }

    // 3. Find the Invoice (Can belong to any school)
    const invoice = await FeeInvoice.findByPk(invoice_id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // 4. Deduct from Agent Wallet and calculate Commission (e.g., 2% fee)
    const commission = parseFloat(amount) * 0.02;
    await agent.decrement('wallet_balance', { by: parseFloat(amount), transaction: t });
    await agent.increment('commission_earned', { by: commission, transaction: t });

    // 5. Log the Agent Transaction
    await AgentTransaction.create({
      agent_id: agent.id,
      transaction_type: 'ProxyPayment',
      amount: amount,
      commission_amount: commission,
      reference_id: invoice.id,
      status: 'Completed'
    }, { transaction: t });

    // 6. Record the actual Fee Payment for the School
    await FeePayment.create({
      school_id: invoice.school_id, // Inherit from invoice
      invoice_id: invoice.id,
      amount: amount,
      payment_method: 'Agent_Proxy',
      payment_reference: `PROXY-${agent.id}-${Date.now()}`,
      status: 'Successful'
    }, { transaction: t });

    // 7. Update Invoice Balance
    await invoice.increment('paid_amount', { by: parseFloat(amount), transaction: t });
    
    // (In a real system, we'd also check if paid_amount >= total_amount to set status to 'Paid')

    await t.commit();

    res.status(200).json({
      status: 'success',
      message: 'Proxy payment processed successfully',
      commission_earned: commission
    });

  } catch (error) {
    await t.rollback();
    console.error('Proxy Payment Error:', error);
    res.status(500).json({ message: 'Server error processing proxy payment' });
  }
};

// @desc    Update the delivery status of a ShuleKit or TichaDeal
// @route   PATCH /api/agency/delivery/:orderId
// @access  Agent Only
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_status } = req.body;
    const userId = req.user.id;

    const agent = await Agent.findOne({ where: { user_id: userId } });
    if (!agent) return res.status(403).json({ message: 'Unauthorized' });

    const order = await DealOrder.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure the agent is assigned to this order, or assign them now
    order.status = delivery_status;
    if (!order.assigned_agent_id) {
      order.assigned_agent_id = agent.id;
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      message: `Delivery status updated to ${delivery_status}`
    });

  } catch (error) {
    console.error('Delivery Update Error:', error);
    res.status(500).json({ message: 'Server error updating delivery' });
  }
};

module.exports = {
  processProxyPayment,
  updateDeliveryStatus
};
