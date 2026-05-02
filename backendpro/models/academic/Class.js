const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Class = sequelize.define('Class', {
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
  academic_group_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'academic_groups',
      key: 'id',
    },
  },
  stream: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. A, B, Blue, North',
  },
  custom_name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional user-friendly name (e.g. P1 Alpha)',
  },
  location_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
  },
  class_teacher_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'FK to Staff (User ID)',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'classes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['academic_group_id', 'stream'],
    },
  ],
});

Class.associate = (models) => {
  Class.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Class.belongsTo(models.AcademicGroup, { foreignKey: 'academic_group_id', as: 'group' });
  Class.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
  // Future: Association with Students via Enrollment
};

module.exports = Class;
