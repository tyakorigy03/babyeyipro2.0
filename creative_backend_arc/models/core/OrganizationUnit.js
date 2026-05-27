const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const OrganizationUnit = sequelize.define('OrganizationUnit', {
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
      model: 'organization_units',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Department',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'organization_units',
  timestamps: true,
  underscored: true,
});

OrganizationUnit.associate = (models) => {
  OrganizationUnit.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  OrganizationUnit.belongsTo(models.OrganizationUnit, { foreignKey: 'parent_id', as: 'parent' });
  OrganizationUnit.hasMany(models.OrganizationUnit, { foreignKey: 'parent_id', as: 'children' });
  OrganizationUnit.hasMany(models.StaffAssignment, { foreignKey: 'unit_id', as: 'assignments' });
};

module.exports = OrganizationUnit;
