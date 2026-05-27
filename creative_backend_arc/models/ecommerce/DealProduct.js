const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DealProduct = sequelize.define('DealProduct', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  partner_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'partners',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('TichaDeal', 'ShuleKit', 'General'),
    defaultValue: 'TichaDeal',
  },
  bundle_contents: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Technical details (e.g. RAM, Storage)',
  },
  original_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  deal_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  main_image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gallery_images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of additional image URLs',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'deal_products',
  timestamps: true,
  underscored: true,
});

DealProduct.associate = (models) => {
  DealProduct.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
  DealProduct.hasMany(models.DealOrder, { foreignKey: 'product_id', as: 'orders' });
  DealProduct.hasMany(models.DealProductVariant, { foreignKey: 'product_id', as: 'variants' });
  DealProduct.belongsToMany(models.School, {
    through: 'school_deal_availability',
    foreignKey: 'product_id',
    otherKey: 'school_id',
    as: 'availableSchools',
  });
};

module.exports = DealProduct;
