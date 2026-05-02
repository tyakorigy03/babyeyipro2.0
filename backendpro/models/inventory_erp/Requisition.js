const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Requisition = sequelize.define('Requisition', {
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
    comment: 'The requester',
  },
  type: {
    type: DataTypes.ENUM('Material', 'Cash', 'Service'),
    defaultValue: 'Material',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total_estimated_cost: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Pending_Approval', 'Approved_By_HOD', 'Approved_By_Admin', 'Disbursed', 'Rejected', 'Cancelled'),
    defaultValue: 'Pending_Approval',
  },
  current_workflow_step_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Link to the multi-stage workflow engine',
  },
}, {
  tableName: 'requisitions',
  timestamps: true,
  underscored: true,
});

Requisition.associate = (models) => {
  Requisition.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Requisition.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'requester' });
  Requisition.hasMany(models.RequisitionItem, { foreignKey: 'requisition_id', as: 'items' });
  Requisition.hasOne(models.Expense, { foreignKey: 'requisition_id', as: 'expenseRecord' });
};

module.exports = Requisition;
