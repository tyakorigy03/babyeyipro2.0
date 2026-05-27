const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Technical name of the permission (e.g. STUDENT_CREATE)',
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Group/Module name (e.g. Students)',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'permissions',
  timestamps: false,
  underscored: true,
});

Permission.associate = (models) => {
  Permission.belongsToMany(models.Role, {
    through: 'role_permissions',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
  });
};

module.exports = Permission;
