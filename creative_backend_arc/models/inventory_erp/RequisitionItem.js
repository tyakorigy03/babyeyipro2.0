const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const RequisitionItem = sequelize.define('RequisitionItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requisition_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'requisitions',
      key: 'id',
    },
  },
  inventory_item_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'inventory_items',
      key: 'id',
    },
  },
  item_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity_requested: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  quantity_approved: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  estimated_unit_cost: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
}, {
  tableName: 'requisition_items',
  timestamps: false,
  underscored: true,
});

RequisitionItem.associate = (models) => {
  RequisitionItem.belongsTo(models.Requisition, { foreignKey: 'requisition_id', as: 'requisition' });
  RequisitionItem.belongsTo(models.InventoryItem, { foreignKey: 'inventory_item_id', as: 'inventoryItem' });
};

module.exports = RequisitionItem;
