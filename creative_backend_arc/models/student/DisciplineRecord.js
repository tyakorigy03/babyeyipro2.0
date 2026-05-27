const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DisciplineRecord = sequelize.define('DisciplineRecord', {
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
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  recorded_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  points: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Negative for deduction, Positive for reward',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'Attendance', 'Behavior', 'Academic'",
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attendance_record_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'attendance_records',
      key: 'id',
    },
  },
  policy_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'discipline_policies',
      key: 'id',
    },
  },
  occurred_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'discipline_records',
  timestamps: true,
  underscored: true,
});

DisciplineRecord.associate = (models) => {
  DisciplineRecord.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  DisciplineRecord.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  DisciplineRecord.belongsTo(models.Staff, { foreignKey: 'recorded_by_staff_id', as: 'recordedBy' });
  DisciplineRecord.belongsTo(models.AttendanceRecord, { foreignKey: 'attendance_record_id', as: 'attendanceRecord' });
  DisciplineRecord.belongsTo(models.DisciplinePolicy, { foreignKey: 'policy_id', as: 'policy' });
};

module.exports = DisciplineRecord;
