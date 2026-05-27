const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AdvanceInstallment = sequelize.define('AdvanceInstallment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  advance_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'advance_requests',
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
    comment: 'Approximate month for the deduction',
  },
}, {
  tableName: 'advance_installments',
  timestamps: true,
  underscored: true,
});

AdvanceInstallment.associate = (models) => {
  AdvanceInstallment.belongsTo(models.AdvanceRequest, { foreignKey: 'advance_id', as: 'advance' });
  AdvanceInstallment.belongsTo(models.PayrollRun, { foreignKey: 'payroll_run_id', as: 'payrollRun' });
};

module.exports = AdvanceInstallment;
