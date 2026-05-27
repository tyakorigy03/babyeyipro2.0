const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const LibraryFine = sequelize.define('LibraryFine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'library_loans',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Unpaid', 'Paid', 'Waived'),
    defaultValue: 'Unpaid',
  },
  discipline_record_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'discipline_records',
      key: 'id',
    },
    comment: 'Link to conduct mark deduction for poor library adherence',
  },
  fee_invoice_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'fee_invoices',
      key: 'id',
    },
    comment: 'Link to school bill for automated fine collection',
  },
}, {
  tableName: 'library_fines',
  timestamps: true,
  underscored: true,
});

LibraryFine.associate = (models) => {
  LibraryFine.belongsTo(models.LibraryLoan, { foreignKey: 'loan_id', as: 'loan' });
  LibraryFine.belongsTo(models.DisciplineRecord, { foreignKey: 'discipline_record_id', as: 'conductDeduction' });
  LibraryFine.belongsTo(models.FeeInvoice, { foreignKey: 'fee_invoice_id', as: 'billRecord' });
};

module.exports = LibraryFine;
