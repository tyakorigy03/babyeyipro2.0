const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  station_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  wallet_balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  commission_earned: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'agents',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

module.exports = Agent;
