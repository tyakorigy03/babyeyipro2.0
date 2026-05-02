const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TransportVehicle = sequelize.define('TransportVehicle', {
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
  plate_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'retired'),
    defaultValue: 'active',
  },
}, {
  tableName: 'transport_vehicles',
  timestamps: true,
  underscored: true,
});

TransportVehicle.associate = (models) => {
  TransportVehicle.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  TransportVehicle.hasMany(models.TransportAssignment, { foreignKey: 'vehicle_id', as: 'assignments' });
};

module.exports = TransportVehicle;
