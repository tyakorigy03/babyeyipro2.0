const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Wallet = sequelize.define('Wallet', {
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
  owner_type: {
    type: DataTypes.ENUM('Student', 'Staff', 'Vendor', 'System'),
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Frozen', 'Closed'),
    defaultValue: 'Active',
  },
  pin_hash: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Hashed PIN for spending authorization',
  },
}, {
  tableName: 'wallets',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['owner_type', 'owner_id'],
    },
  ],
});

Wallet.associate = (models) => {
  Wallet.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Wallet.hasMany(models.WalletTransaction, { foreignKey: 'wallet_id', as: 'transactions' });
};

module.exports = Wallet;
