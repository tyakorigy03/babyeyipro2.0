const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AgentStation = sequelize.define('AgentStation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gps_coordinates: {
    type: DataTypes.STRING,
  },
  region: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'agent_stations',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

module.exports = AgentStation;
