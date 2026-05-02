const { sequelize } = require('../../config/database');
const { Wallet, WalletTransaction } = require('../../models');

// @desc    Process a Wallet-to-Wallet payment (e.g. Student buying from Canteen)
// @route   POST /api/finance/wallets/transfer
// @access  Protected
const processTransfer = async (req, res) => {
  const { sender_wallet_id, receiver_wallet_id, amount, pin, notes } = req.body;

  if (!sender_wallet_id || !receiver_wallet_id || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer parameters' });
  }

  // Start a Managed Transaction for ACID compliance
  const t = await sequelize.transaction();

  try {
    // 1. Fetch Wallets with strict pessimistic locking
    // This prevents race conditions if two terminals try to charge the same wallet simultaneously
    const senderWallet = await Wallet.findOne({
      where: { id: sender_wallet_id, school_id: req.user.school_id },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    const receiverWallet = await Wallet.findOne({
      where: { id: receiver_wallet_id, school_id: req.user.school_id },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!senderWallet || !receiverWallet) {
      await t.rollback();
      return res.status(404).json({ message: 'One or both wallets not found' });
    }

    if (senderWallet.status !== 'Active' || receiverWallet.status !== 'Active') {
      await t.rollback();
      return res.status(403).json({ message: 'One or both wallets are inactive or frozen' });
    }

    // 2. Verify Balance
    if (parseFloat(senderWallet.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // 3. Optional: Verify PIN if required by school settings
    // if (!isValidPin(pin, senderWallet.pin_hash)) throw error;

    // 4. Execute the Ledger Transfer
    senderWallet.balance = parseFloat(senderWallet.balance) - parseFloat(amount);
    receiverWallet.balance = parseFloat(receiverWallet.balance) + parseFloat(amount);

    await senderWallet.save({ transaction: t });
    await receiverWallet.save({ transaction: t });

    // 5. Create the Double-Entry Audit Logs
    // The Debit Log
    await WalletTransaction.create({
      school_id: req.user.school_id,
      wallet_id: senderWallet.id,
      type: 'Debit',
      amount: parseFloat(amount),
      transaction_type: 'Purchase',
      reference_type: 'Wallet',
      reference_id: receiverWallet.id,
      notes: notes || 'Campus Purchase'
    }, { transaction: t });

    // The Credit Log
    await WalletTransaction.create({
      school_id: req.user.school_id,
      wallet_id: receiverWallet.id,
      type: 'Credit',
      amount: parseFloat(amount),
      transaction_type: 'Purchase',
      reference_type: 'Wallet',
      reference_id: senderWallet.id,
      notes: notes || 'Campus Sale'
    }, { transaction: t });

    // 6. Commit the transaction
    await t.commit();

    res.status(200).json({
      status: 'success',
      message: 'Transfer successful',
      data: {
        amount_transferred: amount,
        new_balance: senderWallet.balance
      }
    });

  } catch (error) {
    // If any step fails, roll back the entire transaction
    await t.rollback();
    console.error('Wallet Transfer Error:', error);
    res.status(500).json({ message: 'Transaction failed, funds rolled back safely' });
  }
};

module.exports = {
  processTransfer
};
