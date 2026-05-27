const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeeStructureItem = sequelize.define('FeeStructureItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fee_structure_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'fee_structures',
      key: 'id',
    },
  },
  fee_category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'fee_categories',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  is_optional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'fee_structure_items',
  timestamps: false,
  underscored: true,
});

FeeStructureItem.associate = (models) => {
  FeeStructureItem.belongsTo(models.FeeStructure, { foreignKey: 'fee_structure_id', as: 'feeStructure' });
  FeeStructureItem.belongsTo(models.FeeCategory, { foreignKey: 'fee_category_id', as: 'feeCategory' });
};

module.exports = FeeStructureItem;
