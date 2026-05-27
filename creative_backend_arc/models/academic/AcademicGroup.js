const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AcademicGroup = sequelize.define('AcademicGroup', {
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
  academic_year_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'academic_years',
      key: 'id',
    },
  },
  grade_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'grades',
      key: 'id',
    },
  },
  combination_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'combinations',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. S4 PCM 2024',
  },
  head_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Optional Head of Combination/Grade (User ID)',
  },
}, {
  tableName: 'academic_groups',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['academic_year_id', 'grade_id', 'combination_id'],
    },
  ],
});

AcademicGroup.associate = (models) => {
  AcademicGroup.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AcademicGroup.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });
  AcademicGroup.belongsTo(models.Grade, { foreignKey: 'grade_id', as: 'grade' });
  AcademicGroup.belongsTo(models.Combination, { foreignKey: 'combination_id', as: 'combination' });
  AcademicGroup.hasMany(models.Class, { foreignKey: 'academic_group_id', as: 'classes' });
};

module.exports = AcademicGroup;
