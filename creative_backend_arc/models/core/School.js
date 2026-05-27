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
    allowNull: true,
    unique: true,
    // Validation handled at DB level; allowNull:true prevents crashes
    // when the setup form sends an empty string before email is entered
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
  motto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  founded: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    // NOTE: DB schema uses lowercase — must match exactly
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
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
