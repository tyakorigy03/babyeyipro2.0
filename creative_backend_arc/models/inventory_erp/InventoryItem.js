const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const InventoryItem = sequelize.define('InventoryItem', {
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
  category: {
    type: DataTypes.ENUM('Stationary', 'Kitchen', 'Cleaning', 'Medical', 'Maintenance', 'Other'),
    defaultValue: 'Other',
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'kg', 'box', 'pieces'",
  },
  stock_quantity: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  reorder_level: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
}, {
  tableName: 'inventory_items',
  timestamps: true,
  underscored: true,
});

InventoryItem.associate = (models) => {
  InventoryItem.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  InventoryItem.hasMany(models.InventoryTransaction, { foreignKey: 'inventory_item_id', as: 'transactions' });
};

module.exports = InventoryItem;
