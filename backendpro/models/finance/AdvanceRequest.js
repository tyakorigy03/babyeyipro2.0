const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AdvanceRequest = sequelize.define('AdvanceRequest', {
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
  staff_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  contract_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'staff_contracts',
      key: 'id',
    },
  },
  amount_requested: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'The Principal amount',
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
    comment: 'e.g. 2.50 for 2.5%',
  },
  interest_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  total_repayment_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Principal + Interest',
  },
  repayment_months: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  monthly_installment_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.ENUM('Personal', 'SchoolFees', 'TichaDeals', 'Other'),
    defaultValue: 'Personal',
  },
  target_student_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  target_invoice_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'fee_invoices',
      key: 'id',
    },
  },
  partner_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'partners',
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'School_Approved', 'Partner_Approved', 'Disbursed', 'Rejected', 'Deducted', 'Fully_Paid'),
    defaultValue: 'Pending',
  },
  approved_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  partner_reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'External transaction reference from fintech partner',
  },
}, {
  tableName: 'advance_requests',
  timestamps: true,
  underscored: true,
});

AdvanceRequest.associate = (models) => {
  AdvanceRequest.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AdvanceRequest.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  AdvanceRequest.belongsTo(models.StaffContract, { foreignKey: 'contract_id', as: 'contract' });
  AdvanceRequest.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
  AdvanceRequest.belongsTo(models.Staff, { foreignKey: 'approved_by_staff_id', as: 'approver' });
  AdvanceRequest.belongsTo(models.Student, { foreignKey: 'target_student_id', as: 'targetStudent' });
  AdvanceRequest.belongsTo(models.FeeInvoice, { foreignKey: 'target_invoice_id', as: 'targetInvoice' });
  AdvanceRequest.hasMany(models.AdvanceInstallment, { foreignKey: 'advance_id', as: 'installments' });
};

module.exports = AdvanceRequest;
