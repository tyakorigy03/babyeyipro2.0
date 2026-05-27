const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeeInvoice = sequelize.define('FeeInvoice', {
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
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  fee_structure_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'fee_structures',
      key: 'id',
    },
  },
  academic_year_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'academic_years',
      key: 'id',
    },
  },
  term_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'terms',
      key: 'id',
    },
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  paid_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid', 'Void', 'Refunded'),
    defaultValue: 'Unpaid',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fee_invoices',
  timestamps: true,
  underscored: true,
});

FeeInvoice.associate = (models) => {
  FeeInvoice.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  FeeInvoice.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  FeeInvoice.belongsTo(models.FeeStructure, { foreignKey: 'fee_structure_id', as: 'structure' });
  FeeInvoice.hasMany(models.FeePayment, { foreignKey: 'invoice_id', as: 'payments' });

  // Link to generated PDF in the Universal Document Vault
  FeeInvoice.hasOne(models.Document, {
    foreignKey: 'owner_id',
    constraints: false,
    scope: { owner_type: 'FeeInvoice' },
    as: 'invoiceDocument',
  });
};

module.exports = FeeInvoice;
