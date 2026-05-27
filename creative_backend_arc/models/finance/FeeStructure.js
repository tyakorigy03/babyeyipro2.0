const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const FeeStructure = sequelize.define('FeeStructure', {
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
  academic_year_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'academic_years',
      key: 'id',
    },
  },
  term_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'terms',
      key: 'id',
    },
  },
  target_group_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
    comment: 'Link to universal groups (AcademicGroup, ModularGroup, etc.)',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'S1 Boarding Term 1 Fees'",
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
}, {
  tableName: 'fee_structures',
  timestamps: true,
  underscored: true,
});

FeeStructure.associate = (models) => {
  FeeStructure.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  FeeStructure.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id', as: 'academicYear' });
  FeeStructure.belongsTo(models.Term, { foreignKey: 'term_id', as: 'term' });
  FeeStructure.belongsTo(models.Group, { foreignKey: 'target_group_id', as: 'targetGroup' });
  FeeStructure.hasMany(models.FeeStructureItem, { foreignKey: 'fee_structure_id', as: 'items' });
};

module.exports = FeeStructure;
