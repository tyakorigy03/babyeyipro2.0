const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Term = sequelize.define('Term', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  academic_year_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'academic_years',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'terms',
  timestamps: true,
  underscored: true,
});

Term.associate = (models) => {
  Term.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });
};

module.exports = Term;
