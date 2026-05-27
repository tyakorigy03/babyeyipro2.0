const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const PayrollRun = sequelize.define('PayrollRun', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'May 2024 Regular'",
  },
  payroll_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payroll_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Processing', 'Approved', 'Paid', 'Cancelled'),
    defaultValue: 'Draft',
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  processed_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'payroll_runs',
  timestamps: true,
  underscored: true,
});

PayrollRun.associate = (models) => {
  PayrollRun.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  PayrollRun.belongsTo(models.User, { foreignKey: 'processed_by_user_id', as: 'processedBy' });
  PayrollRun.hasMany(models.Payslip, { foreignKey: 'payroll_run_id', as: 'payslips' });
};

module.exports = PayrollRun;
