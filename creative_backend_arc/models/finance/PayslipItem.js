const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const PayslipItem = sequelize.define('PayslipItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  payslip_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'payslips',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Allowance', 'Deduction'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  tableName: 'payslip_items',
  timestamps: false,
  underscored: true,
});

PayslipItem.associate = (models) => {
  PayslipItem.belongsTo(models.Payslip, { foreignKey: 'payslip_id', as: 'payslip' });
};

module.exports = PayslipItem;
