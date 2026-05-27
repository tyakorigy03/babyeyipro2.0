const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AttendanceAuthorization = sequelize.define('AttendanceAuthorization', {
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
    allowNull: false,
    comment: 'The ID of the specific activity/route/timetable being authorized',
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
}, {
  tableName: 'attendance_authorizations',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

AttendanceAuthorization.associate = (models) => {
  AttendanceAuthorization.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  AttendanceAuthorization.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  AttendanceAuthorization.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
};

module.exports = AttendanceAuthorization;
