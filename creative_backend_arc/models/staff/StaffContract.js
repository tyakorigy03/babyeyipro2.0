const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const StaffContract = sequelize.define('StaffContract', {
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
  staff_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'staff',
      key: 'id',
    },
  },
  contract_type: {
    type: DataTypes.ENUM('Permanent', 'Fixed-Term', 'Contractor', 'Intern', 'Volunteer'),
    defaultValue: 'Permanent',
  },
  pay_frequency: {
    type: DataTypes.ENUM('Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Termly'),
    defaultValue: 'Monthly',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  probation_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Active', 'Expired', 'Terminated', 'Resigned'),
    defaultValue: 'Draft',
  },
  terms_and_conditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'staff_contracts',
  timestamps: true,
  underscored: true,
});

StaffContract.associate = (models) => {
  StaffContract.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  StaffContract.belongsTo(models.Staff, { foreignKey: 'staff_id', as: 'staff' });
};

module.exports = StaffContract;
