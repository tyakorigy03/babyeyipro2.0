const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DealInstallment = sequelize.define('DealInstallment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deal_orders',
      key: 'id',
    },
  },
  payroll_run_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'payroll_runs',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Skipped'),
    defaultValue: 'Pending',
  },
  scheduled_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'deal_installments',
  timestamps: true,
  underscored: true,
});

DealInstallment.associate = (models) => {
  DealInstallment.belongsTo(models.DealOrder, { foreignKey: 'order_id', as: 'order' });
  DealInstallment.belongsTo(models.PayrollRun, { foreignKey: 'payroll_run_id', as: 'payrollRun' });
};

module.exports = DealInstallment;
