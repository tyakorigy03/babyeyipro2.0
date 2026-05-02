const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const WorkflowPolicy = sequelize.define('WorkflowPolicy', {
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
  action_key: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The technical key for the action requiring approval (e.g. MARK_DEDUCTION)',
  },
  trigger_role_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'The role that triggers the action. If NULL, applies to all.',
  },
  approval_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  approver_unit_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'The organizational unit responsible for approval',
  },
  approver_role_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'The specific role responsible for approval',
  },
  min_approvals: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'workflow_policies',
  timestamps: true,
  underscored: true,
});

WorkflowPolicy.associate = (models) => {
  WorkflowPolicy.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  WorkflowPolicy.belongsTo(models.Role, { foreignKey: 'trigger_role_id', as: 'trigger_role' });
  WorkflowPolicy.belongsTo(models.OrganizationUnit, { foreignKey: 'approver_unit_id', as: 'approver_unit' });
  WorkflowPolicy.belongsTo(models.Role, { foreignKey: 'approver_role_id', as: 'approver_role' });
};

module.exports = WorkflowPolicy;
