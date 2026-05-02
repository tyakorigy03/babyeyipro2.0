const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'attendance_sessions',
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
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    defaultValue: 'present',
  },
  recording_method: {
    type: DataTypes.ENUM('manual', 'nfc', 'biometric', 'qr'),
    defaultValue: 'manual',
  },
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Stores NFC tag IDs, GPS coordinates, device IDs, etc.',
  },
}, {
  tableName: 'attendance_records',
  timestamps: false,
  underscored: true,
});

AttendanceRecord.associate = (models) => {
  AttendanceRecord.belongsTo(models.AttendanceSession, { foreignKey: 'session_id', as: 'session' });
  AttendanceRecord.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = AttendanceRecord;
