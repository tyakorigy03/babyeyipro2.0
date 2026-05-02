const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RoutineTimeSlot = sequelize.define('RoutineTimeSlot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  template_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routine_templates',
      key: 'id',
    },
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'routine_time_slots',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

RoutineTimeSlot.associate = (models) => {
  RoutineTimeSlot.belongsTo(models.RoutineTemplate, { foreignKey: 'template_id', as: 'template' });
  RoutineTimeSlot.hasMany(models.RoutineActivity, { foreignKey: 'slot_id', as: 'activities' });
};

module.exports = RoutineTimeSlot;
