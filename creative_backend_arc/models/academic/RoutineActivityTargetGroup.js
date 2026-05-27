const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RoutineActivityTargetGroup = sequelize.define('RoutineActivityTargetGroup', {
  activity_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'routine_activities',
      key: 'id',
    },
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
}, {
  tableName: 'routine_activity_target_groups',
  timestamps: false,
  underscored: true,
});

RoutineActivityTargetGroup.associate = (models) => {
  RoutineActivityTargetGroup.belongsTo(models.RoutineActivity, { foreignKey: 'activity_id', as: 'activity' });
  RoutineActivityTargetGroup.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
};

module.exports = RoutineActivityTargetGroup;
