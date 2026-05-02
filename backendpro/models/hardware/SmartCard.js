const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SmartCard = sequelize.define('SmartCard', {
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'The owner of the card (Student or Staff)',
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'The unique RFID/NFC Tag identifier',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Lost', 'Blocked'),
    defaultValue: 'Active',
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'smart_cards',
  timestamps: true,
  underscored: true,
});

SmartCard.associate = (models) => {
  SmartCard.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  SmartCard.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  SmartCard.hasMany(models.SmartCardLog, { foreignKey: 'card_id', as: 'taps' });
};

module.exports = SmartCard;
