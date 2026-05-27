const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Notification = sequelize.define('Notification', {
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
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  channel_used: {
    type: DataTypes.ENUM('App', 'WhatsApp', 'SMS', 'Email'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Queued', 'Sent', 'Delivered', 'Read', 'Failed'),
    defaultValue: 'Queued',
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "The source event (e.g. 'AttendanceRecord')",
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'notifications',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

Notification.associate = (models) => {
  Notification.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Notification.belongsTo(models.User, { foreignKey: 'user_id', as: 'recipient' });
};

module.exports = Notification;
