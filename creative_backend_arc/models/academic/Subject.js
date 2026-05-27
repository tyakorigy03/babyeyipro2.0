const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Subject = sequelize.define('Subject', {
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
  level_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'levels',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'subjects',
  timestamps: true,
  underscored: true,
});

Subject.associate = (models) => {
  Subject.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Subject.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
  Subject.hasMany(models.TimetableEntry, { foreignKey: 'subject_id', as: 'timetableEntries' });
};

module.exports = Subject;
