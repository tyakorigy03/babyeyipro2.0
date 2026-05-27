const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AttendanceSession = sequelize.define('AttendanceSession', {
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
  reference_type: {
    type: DataTypes.ENUM('TimetableEntry', 'TransportRoute', 'RoutineActivity', 'General'),
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'Links to TimetableEntry, TransportRoute, or RoutineActivity based on type',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  taken_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  session_status: {
    type: DataTypes.ENUM('open', 'closed', 'cancelled'),
    defaultValue: 'open',
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'attendance_sessions',
  timestamps: true,
  underscored: true,
});

AttendanceSession.associate = (models) => {
  AttendanceSession.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AttendanceSession.belongsTo(models.Staff, { foreignKey: 'taken_by_staff_id', as: 'recordedBy' });
  AttendanceSession.hasMany(models.AttendanceRecord, { foreignKey: 'session_id', as: 'records' });

  // Dynamic associations based on reference_type
  AttendanceSession.belongsTo(models.TimetableEntry, { foreignKey: 'reference_id', constraints: false, as: 'timetableEntry' });
  AttendanceSession.belongsTo(models.TransportRoute, { foreignKey: 'reference_id', constraints: false, as: 'transportRoute' });
  AttendanceSession.belongsTo(models.RoutineActivity, { foreignKey: 'reference_id', constraints: false, as: 'routineActivity' });
};

module.exports = AttendanceSession;
