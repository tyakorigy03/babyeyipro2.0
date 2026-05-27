const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Block = sequelize.define('Block', {
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
    comment: 'e.g. Block A, Science Wing, West Campus',
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'blocks',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'name'],
    },
  ],
});

Block.associate = (models) => {
  Block.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Block.hasMany(models.Location, { foreignKey: 'block_id', as: 'locations' });
};

module.exports = Block;
