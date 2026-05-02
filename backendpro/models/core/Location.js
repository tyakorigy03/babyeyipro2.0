const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Location = sequelize.define('Location', {
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
    comment: 'e.g. Room 101, Main Hall, Biology Lab',
  },
  type: {
    type: DataTypes.ENUM('Classroom', 'Laboratory', 'Hall', 'Field', 'Office', 'Other'),
    defaultValue: 'Classroom',
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'locations',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'name'],
    },
  ],
});

Location.associate = (models) => {
  Location.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Location.hasMany(models.Class, { foreignKey: 'location_id', as: 'classes' });
  Location.hasMany(models.RoutineActivity, { foreignKey: 'location_id', as: 'activities' });
};

module.exports = Location;
