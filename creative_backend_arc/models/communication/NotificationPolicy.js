const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const NotificationPolicy = sequelize.define('NotificationPolicy', {
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
  event_type: {
    type: DataTypes.ENUM('Attendance', 'Purchase', 'Discipline', 'FeePayment', 'LibraryOverdue', 'Requisition', 'StaffAdvance', 'StaffRoster', 'Announcement'),
    allowNull: false,
  },
  trigger_condition: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "e.g. 'CheckIn', 'CheckOut', 'LowBalance'",
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  default_channels: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'e.g. ["App", "WhatsApp"]',
  },
}, {
  tableName: 'notification_policies',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'event_type', 'trigger_condition'],
    },
  ],
});

NotificationPolicy.associate = (models) => {
  NotificationPolicy.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
};

module.exports = NotificationPolicy;
