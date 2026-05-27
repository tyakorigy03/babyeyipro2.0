const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const GroupRole = sequelize.define('GroupRole', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g. Captain, President, Coach, SG, Vice',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'group_roles',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['group_id', 'name'],
    },
  ],
});

GroupRole.associate = (models) => {
  GroupRole.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
  GroupRole.hasMany(models.GroupMembership, { foreignKey: 'group_role_id', as: 'memberships' });
};

module.exports = GroupRole;
