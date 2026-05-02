const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const PayGrade = sequelize.define('PayGrade', {
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
    comment: "e.g. 'Senior Teacher Grade 1'",
  },
  base_salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'pay_grades',
  timestamps: true,
  underscored: true,
});

PayGrade.associate = (models) => {
  PayGrade.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  PayGrade.hasMany(models.StaffSalaryConfiguration, { foreignKey: 'pay_grade_id', as: 'staffConfigs' });
};

module.exports = PayGrade;
