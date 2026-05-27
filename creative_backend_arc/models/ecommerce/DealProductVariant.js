const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DealProductVariant = sequelize.define('DealProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deal_products',
      key: 'id',
    },
  },
  variant_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'Blue - 256GB' or 'Size XL'",
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  additional_price: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'deal_product_variants',
  timestamps: true,
  underscored: true,
});

DealProductVariant.associate = (models) => {
  DealProductVariant.belongsTo(models.DealProduct, { foreignKey: 'product_id', as: 'product' });
};

module.exports = DealProductVariant;
