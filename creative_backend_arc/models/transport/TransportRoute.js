const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TransportRoute = sequelize.define('TransportRoute', {
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
    comment: 'e.g. Kigali - Kimironko Line',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fee: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
}, {
  tableName: 'transport_routes',
  timestamps: true,
  underscored: true,
});

TransportRoute.associate = (models) => {
  TransportRoute.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  TransportRoute.hasMany(models.TransportAssignment, { foreignKey: 'route_id', as: 'assignments' });
  TransportRoute.hasMany(models.Student, { foreignKey: 'transport_route_id', as: 'students' });
};

module.exports = TransportRoute;
