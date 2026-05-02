const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeeCategory = sequelize.define('FeeCategory', {
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
    comment: "e.g. 'Tuition', 'Transport', 'Library', 'Uniform'",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fee_categories',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

FeeCategory.associate = (models) => {
  FeeCategory.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  FeeCategory.hasMany(models.FeeStructureItem, { foreignKey: 'fee_category_id', as: 'structureItems' });
};

module.exports = FeeCategory;
