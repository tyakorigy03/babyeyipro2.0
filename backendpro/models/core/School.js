const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organization_type: {
    type: DataTypes.ENUM('School', 'Corporate'),
    defaultValue: 'School',
    comment: 'Allows non-school entities to manage staff and payroll',
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
  },
}, {
  tableName: 'schools',
  timestamps: true,
  underscored: true,
});

School.associate = (models) => {
  School.hasMany(models.User, { foreignKey: 'school_id', as: 'users' });
  School.hasMany(models.Staff, { foreignKey: 'school_id', as: 'staff' });
  School.hasMany(models.Student, { foreignKey: 'school_id', as: 'students' });
  School.hasMany(models.AcademicYear, { foreignKey: 'school_id', as: 'academicYears' });
  // Add other associations as needed
};

module.exports = School;
