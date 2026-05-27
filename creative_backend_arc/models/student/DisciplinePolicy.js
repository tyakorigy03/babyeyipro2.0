const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DisciplinePolicy = sequelize.define('DisciplinePolicy', {
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
  reference_type: {
    type: DataTypes.ENUM('RoutineActivity', 'TimetableEntry', 'General'),
    defaultValue: 'General',
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Link to specific Activity or Timetable Entry',
  },
  violation_type: {
    type: DataTypes.ENUM('Absent', 'Late', 'Misconduct', 'Uniform', 'Other'),
    allowNull: false,
  },
  marks_to_deduct: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
  },
  is_automatic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'If true, deduction happens instantly when attendance is recorded',
  },
}, {
  tableName: 'discipline_policies',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

DisciplinePolicy.associate = (models) => {
  DisciplinePolicy.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  DisciplinePolicy.hasMany(models.DisciplineRecord, { foreignKey: 'policy_id', as: 'records' });
};

module.exports = DisciplinePolicy;
