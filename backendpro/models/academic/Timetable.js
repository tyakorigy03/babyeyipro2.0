const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Timetable = sequelize.define('Timetable', {
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
  term_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'terms',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Academic', 'Extracurricular', 'Exam', 'Other'),
    defaultValue: 'Academic',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'timetables',
  timestamps: true,
  underscored: true,
});

Timetable.associate = (models) => {
  Timetable.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Timetable.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });
  Timetable.belongsTo(models.Term, { foreignKey: 'term_id', as: 'term' });
  Timetable.hasMany(models.TimetableEntry, { foreignKey: 'timetable_id', as: 'entries' });
};

module.exports = Timetable;
