const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Enrollment = sequelize.define('Enrollment', {
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
  class_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'classes',
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
  status: {
    type: DataTypes.ENUM('Active', 'Withdrawn', 'Transferred', 'Suspended', 'Completed'),
    defaultValue: 'Active',
  },
  promotion_status: {
    type: DataTypes.ENUM('Pending', 'Promoted', 'Repeated', 'Graduated'),
    defaultValue: 'Pending',
  },
  promotion_decision: {
    type: DataTypes.ENUM('Pass', 'Fail', 'Incomplete'),
    defaultValue: 'Incomplete',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'enrollments',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'academic_year_id'],
    },
  ],
});

Enrollment.associate = (models) => {
  Enrollment.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Enrollment.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  Enrollment.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
  Enrollment.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });
};

module.exports = Enrollment;
