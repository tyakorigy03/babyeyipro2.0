const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Student = sequelize.define('Student', {
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
    allowNull: true,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  student_id_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'unique_student_school',
    comment: 'School-specific student identification number',
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Rwandan',
  },
  residence: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admission_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  dismissal_mode: {
    type: DataTypes.ENUM('Bus', 'Parent Pickup', 'Self', 'Other'),
    defaultValue: 'Parent Pickup',
  },
  transport_route_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'transport_routes',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('applicant', 'pending_approval', 'active', 'inactive', 'graduated', 'transferred', 'dropped'),
    defaultValue: 'applicant',
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['school_id', 'student_id_number'],
    },
  ],
});

Student.associate = (models) => {
  Student.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Student.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Student.belongsToMany(models.Parent, {
    through: 'student_parents',
    foreignKey: 'student_id',
    otherKey: 'parent_id',
    as: 'parents',
  });
  Student.belongsTo(models.TransportRoute, { foreignKey: 'transport_route_id', as: 'transportRoute' });
};

module.exports = Student;
