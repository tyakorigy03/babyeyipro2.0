const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Group = sequelize.define('Group', {
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
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g. Fans Club, Football Team, Red House',
  },
  type: {
    type: DataTypes.ENUM('System', 'Academic', 'Extracurricular', 'Administrative', 'Residential', 'Custom'),
    defaultValue: 'Custom',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'groups',
  timestamps: true,
  underscored: true,
});

Group.associate = (models) => {
  Group.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Group.belongsTo(models.Group, { foreignKey: 'parent_id', as: 'parent' });
  Group.hasMany(models.Group, { foreignKey: 'parent_id', as: 'subGroups' });
  Group.hasMany(models.GroupRole, { foreignKey: 'group_id', as: 'roles' });
  Group.hasMany(models.GroupMembership, { foreignKey: 'group_id', as: 'memberships' });
};

module.exports = Group;
