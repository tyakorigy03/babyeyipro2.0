const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Combination = sequelize.define('Combination', {
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
  level_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'levels',
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'combinations',
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

Combination.associate = (models) => {
  Combination.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Combination.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
  Combination.hasMany(models.Class, { foreignKey: 'combination_id', as: 'classes' });
};

module.exports = Combination;
