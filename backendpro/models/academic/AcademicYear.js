const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g. 2024-2025',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    defaultValue: 'inactive',
  },
}, {
  tableName: 'academic_years',
  timestamps: true,
  underscored: true,
});

AcademicYear.associate = (models) => {
  AcademicYear.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AcademicYear.hasMany(models.Term, { foreignKey: 'academic_year_id', as: 'terms' });
  AcademicYear.hasMany(models.Class, { foreignKey: 'academic_year_id', as: 'classes' });
};

module.exports = AcademicYear;
