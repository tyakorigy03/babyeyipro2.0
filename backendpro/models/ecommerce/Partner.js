const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Fintech', 'Vendor', 'Insurance', 'Bank', 'Other'),
    defaultValue: 'Vendor',
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  api_credentials: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'For automated integrations with partner platforms',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'partners',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

Partner.associate = (models) => {
  Partner.hasMany(models.DealProduct, { foreignKey: 'partner_id', as: 'products' });
  Partner.hasMany(models.AdvanceRequest, { foreignKey: 'partner_id', as: 'advances' });
};

module.exports = Partner;
