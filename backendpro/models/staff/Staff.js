const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'id',
    },
  },
  staff_number: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'School-assigned staff identification number',
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employment_type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Intern'),
    defaultValue: 'Full-time',
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  base_salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'on_leave', 'suspended', 'terminated'),
    defaultValue: 'active',
  },
}, {
  tableName: 'staff',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'staff_number'],
    },
  ],
});

Staff.associate = (models) => {
  Staff.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Staff.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
};

module.exports = Staff;
