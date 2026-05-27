const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SchoolCalendar = sequelize.define('SchoolCalendar', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  routine_template_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routine_templates',
      key: 'id',
    },
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_academic_day: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'school_calendar',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

SchoolCalendar.associate = (models) => {
  SchoolCalendar.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  SchoolCalendar.belongsTo(models.RoutineTemplate, { foreignKey: 'routine_template_id', as: 'routineTemplate' });
};

module.exports = SchoolCalendar;
