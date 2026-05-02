const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DealOrder = sequelize.define('DealOrder', {
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
  buyer_user_id: { // Replaced staff_id to allow Parents to buy ShuleKits
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deal_products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  payment_mode: {
    type: DataTypes.ENUM('Immediate', 'Payroll_Deduction', 'Wallet', 'Proxy'),
    defaultValue: 'Immediate',
  },
  repayment_months: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Dispatched', 'AtAgentStation', 'Delivered', 'Cancelled', 'Fully_Paid'),
    defaultValue: 'Pending',
  },
  delivery_method: {
    type: DataTypes.ENUM('AgentPickup', 'SchoolDelivery', 'HomeDelivery'),
    defaultValue: 'AgentPickup',
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assigned_agent_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  partner_reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tracking ID from the vendor',
  },
}, {
  tableName: 'deal_orders',
  timestamps: true,
  underscored: true,
});

DealOrder.associate = (models) => {
  DealOrder.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  DealOrder.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  DealOrder.belongsTo(models.DealProduct, { foreignKey: 'product_id', as: 'product' });
  DealOrder.hasMany(models.DealInstallment, { foreignKey: 'order_id', as: 'installments' });
};

module.exports = DealOrder;
