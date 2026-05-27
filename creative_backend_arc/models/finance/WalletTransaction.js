const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'id',
    },
  },
  wallet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'wallets',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('Credit', 'Debit'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM('TopUp', 'Purchase', 'Withdrawal', 'Transfer', 'CashOut', 'Refund'),
    allowNull: false,
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "e.g. 'smart_card_logs', 'requisitions'",
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Cancelled'),
    defaultValue: 'Completed',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'wallet_transactions',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

WalletTransaction.associate = (models) => {
  WalletTransaction.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  WalletTransaction.belongsTo(models.Wallet, { foreignKey: 'wallet_id', as: 'wallet' });
};

module.exports = WalletTransaction;
