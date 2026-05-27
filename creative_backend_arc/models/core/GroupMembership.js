const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const GroupMembership = sequelize.define('GroupMembership', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  group_role_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'group_roles',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'left'),
    defaultValue: 'active',
  },
  joined_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  left_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'group_memberships',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

GroupMembership.associate = (models) => {
  GroupMembership.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
  GroupMembership.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  GroupMembership.belongsTo(models.GroupRole, { foreignKey: 'group_role_id', as: 'groupRole' });
};

module.exports = GroupMembership;
