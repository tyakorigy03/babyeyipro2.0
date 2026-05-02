const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RoutineTemplate = sequelize.define('RoutineTemplate', {
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
    comment: 'e.g. Standard School Day, Half Day, Exam Day',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('academic', 'half_day', 'exam', 'holiday', 'special'),
    defaultValue: 'academic',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'routine_templates',
  timestamps: true,
  underscored: true,
});

RoutineTemplate.associate = (models) => {
  RoutineTemplate.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  RoutineTemplate.hasMany(models.RoutineTimeSlot, { foreignKey: 'template_id', as: 'timeSlots' });
};

module.exports = RoutineTemplate;
