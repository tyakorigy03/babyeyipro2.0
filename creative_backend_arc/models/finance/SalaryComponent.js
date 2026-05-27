const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SalaryComponent = sequelize.define('SalaryComponent', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'Housing Allowance', 'NSSF Deduction'",
  },
  type: {
    type: DataTypes.ENUM('Allowance', 'Deduction'),
    allowNull: false,
  },
  calculation_type: {
    type: DataTypes.ENUM('Fixed', 'Percentage'),
    defaultValue: 'Fixed',
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Fixed amount or Percentage value',
  },
  is_statutory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'e.g. Tax/Social Security mandated by law',
  },
}, {
  tableName: 'salary_components',
  timestamps: true,
  underscored: true,
});

SalaryComponent.associate = (models) => {
  SalaryComponent.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  SalaryComponent.belongsToMany(models.Staff, {
    through: 'staff_salary_component_mappings',
    foreignKey: 'component_id',
    otherKey: 'staff_id',
    as: 'assignedStaff',
  });
};

module.exports = SalaryComponent;
