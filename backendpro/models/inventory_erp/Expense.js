const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Expense = sequelize.define('Expense', {
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
  requisition_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'requisitions',
      key: 'id',
    },
    comment: 'Optional link to original request for traceability',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'Kitchen Supplies', 'Maintenance', 'Staff Bonus'",
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('Cash', 'Bank', 'Mobile Money', 'Cheque'),
    defaultValue: 'Cash',
  },
  paid_to: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Vendor name or Staff name',
  },
  date_paid: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  recorded_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'expenses',
  timestamps: true,
  underscored: true,
});

Expense.associate = (models) => {
  Expense.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Expense.belongsTo(models.Requisition, { foreignKey: 'requisition_id', as: 'requisition' });
  Expense.belongsTo(models.Staff, { foreignKey: 'recorded_by_staff_id', as: 'recordedBy' });
};

module.exports = Expense;
