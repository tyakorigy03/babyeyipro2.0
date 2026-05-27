const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RoutineActivity = sequelize.define('RoutineActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  slot_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routine_time_slots',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g. Morning Assembly, Mathematics, Lunch Break',
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  is_attendance_point: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  attendance_method: {
    type: DataTypes.ENUM('mass', 'per_class', 'per_student'),
    defaultValue: 'mass',
  },
  responsible_group_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_multi_instance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True if this activity happens in parallel across multiple locations (like lessons)',
  },
  transport_route_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'transport_routes',
      key: 'id',
    },
  },
}, {
  tableName: 'routine_activities',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

RoutineActivity.associate = (models) => {
  RoutineActivity.belongsTo(models.RoutineTimeSlot, { foreignKey: 'slot_id', as: 'slot' });
  RoutineActivity.belongsTo(models.Group, { foreignKey: 'responsible_group_id', as: 'responsibleGroup' });
  RoutineActivity.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
  RoutineActivity.belongsTo(models.TransportRoute, { foreignKey: 'transport_route_id', as: 'transportRoute' });
  RoutineActivity.hasMany(models.RoutineActivityTargetGroup, { foreignKey: 'activity_id', as: 'targetGroups' });
};

module.exports = RoutineActivity;
