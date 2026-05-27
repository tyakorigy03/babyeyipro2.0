const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Role = sequelize.define('Role', {
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
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Flags if this is a core system role that cannot be deleted',
  },
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'name'],
    },
  ],
});

Role.associate = (models) => {
  Role.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
  Role.belongsToMany(models.Permission, {
    through: 'role_permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
  });
};

module.exports = Role;
