const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const UserNotificationPreference = sequelize.define('UserNotificationPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  channel_priority: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'e.g. ["App", "WhatsApp", "SMS"]',
  },
  is_muted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quiet_hours_start: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  quiet_hours_end: {
    type: DataTypes.TIME,
    allowNull: true,
  },
}, {
  tableName: 'user_notification_preferences',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

UserNotificationPreference.associate = (models) => {
  UserNotificationPreference.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = UserNotificationPreference;
