const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SmartCardLog = sequelize.define('SmartCardLog', {
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
  card_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'smart_cards',
      key: 'id',
    },
  },
  reader_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'smart_card_readers',
      key: 'id',
    },
  },
  tap_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  action_type: {
    type: DataTypes.ENUM('CheckIn', 'CheckOut', 'Attendance', 'Payment', 'Verify'),
    defaultValue: 'Attendance',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'e.g. GPS coordinates for Bus readers or transaction IDs',
  },
  attendance_record_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'attendance_records',
      key: 'id',
    },
    comment: 'Links to the attendance record if automatically mapped',
  },
}, {
  tableName: 'smart_card_logs',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

SmartCardLog.associate = (models) => {
  SmartCardLog.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  SmartCardLog.belongsTo(models.SmartCard, { foreignKey: 'card_id', as: 'card' });
  SmartCardLog.belongsTo(models.SmartCardReader, { foreignKey: 'reader_id', as: 'reader' });
  SmartCardLog.belongsTo(models.AttendanceRecord, { foreignKey: 'attendance_record_id', as: 'attendanceRecord' });
};

module.exports = SmartCardLog;
