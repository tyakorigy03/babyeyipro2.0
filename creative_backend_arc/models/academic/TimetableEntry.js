const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TimetableEntry = sequelize.define('TimetableEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  timetable_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'timetables',
      key: 'id',
    },
  },
  day_of_week: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false,
  },
  slot_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routine_time_slots',
      key: 'id',
    },
  },
  staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
  },
  subject_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'subjects',
      key: 'id',
    },
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
}, {
  tableName: 'timetable_entries',
  timestamps: true,
  underscored: true,
});

TimetableEntry.associate = (models) => {
  TimetableEntry.belongsTo(models.Timetable, { foreignKey: 'timetable_id', as: 'timetable' });
  TimetableEntry.belongsTo(models.RoutineTimeSlot, { foreignKey: 'slot_id', as: 'slot' });
  TimetableEntry.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
  TimetableEntry.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
  TimetableEntry.belongsTo(models.Subject, { foreignKey: 'subject_id', as: 'subject' });
  TimetableEntry.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
};

module.exports = TimetableEntry;
