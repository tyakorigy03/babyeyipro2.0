const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const StaffSalaryConfiguration = sequelize.define('StaffSalaryConfiguration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  pay_grade_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'pay_grades',
      key: 'id',
    },
  },
  custom_base_salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Overrides pay_grade base if set',
  },
  payment_method: {
    type: DataTypes.ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque'),
    defaultValue: 'Bank',
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobile_money_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tax_id_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'staff_salary_configurations',
  timestamps: true,
  underscored: true,
});

StaffSalaryConfiguration.associate = (models) => {
  StaffSalaryConfiguration.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  StaffSalaryConfiguration.belongsTo(models.PayGrade, { foreignKey: 'pay_grade_id', as: 'payGrade' });
};

module.exports = StaffSalaryConfiguration;
