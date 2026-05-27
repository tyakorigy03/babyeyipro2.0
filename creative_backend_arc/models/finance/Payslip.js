const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Payslip = sequelize.define('Payslip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  payroll_run_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'payroll_runs',
      key: 'id',
    },
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  base_salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  total_allowances: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  total_deductions: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  net_salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Generated', 'Pending_Approval', 'Paid', 'Failed'),
    defaultValue: 'Generated',
  },
  payment_reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'payslips',
  timestamps: true,
  underscored: true,
});

Payslip.associate = (models) => {
  Payslip.belongsTo(models.PayrollRun, { foreignKey: 'payroll_run_id', as: 'run' });
  Payslip.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  Payslip.hasMany(models.PayslipItem, { foreignKey: 'payslip_id', as: 'items' });
};

module.exports = Payslip;
