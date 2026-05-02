const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Level = sequelize.define('Level', {
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
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'levels',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'name'],
    },
  ],
});

Level.associate = (models) => {
  Level.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Level.hasMany(models.Grade, { foreignKey: 'level_id', as: 'grades' });
  Level.hasMany(models.Combination, { foreignKey: 'level_id', as: 'combinations' });
};

module.exports = Level;
