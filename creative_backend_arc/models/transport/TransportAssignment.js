const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TransportAssignment = sequelize.define('TransportAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  route_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'transport_routes',
      key: 'id',
    },
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'transport_vehicles',
      key: 'id',
    },
  },
  driver_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Link to Staff ID',
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'transport_assignments',
  timestamps: false,
  underscored: true,
});

TransportAssignment.associate = (models) => {
  TransportAssignment.belongsTo(models.TransportRoute, { foreignKey: 'route_id', as: 'route' });
  TransportAssignment.belongsTo(models.TransportVehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
  TransportAssignment.belongsTo(models.Staff, { foreignKey: 'driver_id', as: 'driver' });
};

module.exports = TransportAssignment;
