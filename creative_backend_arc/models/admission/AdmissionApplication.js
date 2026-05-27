const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AdmissionApplication = sequelize.define('AdmissionApplication', {
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
  academic_year_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  target_class_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  current_stage: {
    type: DataTypes.STRING,
    defaultValue: 'Initial Application',
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Pending', 'In Progress', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
  },
  application_data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON field for school-specific custom enrollment data',
  },
}, {
  tableName: 'admission_applications',
  timestamps: true,
  underscored: true,
});

AdmissionApplication.associate = (models) => {
  AdmissionApplication.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AdmissionApplication.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  AdmissionApplication.hasMany(models.AdmissionWorkflowLog, { foreignKey: 'application_id', as: 'logs' });
};

module.exports = AdmissionApplication;
