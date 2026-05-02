const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Parent = sequelize.define('Parent', {
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
    references: {
      model: 'users',
      key: 'id',
    },
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'parents',
  timestamps: true,
  underscored: true,
});

Parent.associate = (models) => {
  Parent.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Parent.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Parent.belongsToMany(models.Student, {
    through: 'student_parents',
    foreignKey: 'parent_id',
    otherKey: 'student_id',
    as: 'students',
  });
};

module.exports = Parent;
