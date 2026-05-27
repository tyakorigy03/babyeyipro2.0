const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
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
  leave_type: {
    type: DataTypes.ENUM('Sick', 'Medical', 'Personal', 'Emergency', 'Official', 'Other'),
    defaultValue: 'Personal',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Cancelled'),
    defaultValue: 'Pending',
  },
  approved_by_staff_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  approval_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true,
});

LeaveRequest.associate = (models) => {
  LeaveRequest.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  LeaveRequest.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  LeaveRequest.belongsTo(models.Staff, { foreignKey: 'approved_by_staff_id', as: 'approver' });
};

module.exports = LeaveRequest;
