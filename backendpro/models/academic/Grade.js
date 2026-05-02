const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  level_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'levels',
      key: 'id',
    },
  },
  grade_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'grades',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['level_id', 'name'],
    },
  ],
});

Grade.associate = (models) => {
  Grade.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
  Grade.hasMany(models.Class, { foreignKey: 'grade_id', as: 'classes' });
};

module.exports = Grade;
