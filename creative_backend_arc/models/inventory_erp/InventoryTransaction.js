const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const InventoryTransaction = sequelize.define('InventoryTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  inventory_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'inventory_items',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('In', 'Out', 'Adjustment'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reference_type: {
    type: DataTypes.ENUM('Purchase', 'Requisition', 'Adjustment', 'Loss'),
    defaultValue: 'Requisition',
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Link to specific Requisition or Purchase Order',
  },
}, {
  tableName: 'inventory_transactions',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

InventoryTransaction.associate = (models) => {
  InventoryTransaction.belongsTo(models.InventoryItem, { foreignKey: 'inventory_item_id', as: 'item' });
  InventoryTransaction.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'recordedBy' });
};

module.exports = InventoryTransaction;
