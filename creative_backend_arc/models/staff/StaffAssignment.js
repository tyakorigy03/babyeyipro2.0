const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const StaffAssignment = sequelize.define('StaffAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organization_units',
      key: 'id',
    },
  },
  position_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The specific title within the unit (e.g. Director, HOD, Lead Teacher)',
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'staff_assignments',
  timestamps: true,
  updatedAt: false, // Only created_at needed
  underscored: true,
});

StaffAssignment.associate = (models) => {
  StaffAssignment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  StaffAssignment.belongsTo(models.OrganizationUnit, { foreignKey: 'unit_id', as: 'unit' });
};

module.exports = StaffAssignment;
