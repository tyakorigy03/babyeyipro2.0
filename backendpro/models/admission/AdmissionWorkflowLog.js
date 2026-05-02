const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AdmissionWorkflowLog = sequelize.define('AdmissionWorkflowLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'admission_applications',
      key: 'id',
    },
  },
  from_stage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  to_stage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    comment: 'Action performed (e.g. Approved, Rejected, Sent Back)',
  },
  processed_by_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'admission_workflow_logs',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

AdmissionWorkflowLog.associate = (models) => {
  AdmissionWorkflowLog.belongsTo(models.AdmissionApplication, { foreignKey: 'application_id', as: 'application' });
  AdmissionWorkflowLog.belongsTo(models.User, { foreignKey: 'processed_by_user_id', as: 'processor' });
};

module.exports = AdmissionWorkflowLog;
