const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeePayment = sequelize.define('FeePayment', {
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
  invoice_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'fee_invoices',
      key: 'id',
    },
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('Bank', 'Mobile Money', 'Cash', 'Cheque', 'Scholarship', 'Waiver'),
    allowNull: false,
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Receipt or Transaction ID',
  },
  collected_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fee_payments',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

FeePayment.associate = (models) => {
  FeePayment.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  FeePayment.belongsTo(models.FeeInvoice, { foreignKey: 'invoice_id', as: 'invoice' });
  FeePayment.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  FeePayment.belongsTo(models.Staff, { foreignKey: 'collected_by_staff_id', as: 'collector' });
  
  // Link to digital receipt in the Universal Document Vault
  FeePayment.hasOne(models.Document, {
    foreignKey: 'owner_id',
    constraints: false,
    scope: { owner_type: 'FeePayment' },
    as: 'receiptDocument',
  });
};

module.exports = FeePayment;
