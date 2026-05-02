const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AgentTransaction = sequelize.define('AgentTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM('ProxyPayment', 'DeliveryCommission', 'WalletTopUp', 'Withdrawal'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  commission_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Completed', 'Pending', 'Failed', 'Reversed'),
    defaultValue: 'Completed',
  },
}, {
  tableName: 'agent_transactions',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

module.exports = AgentTransaction;
