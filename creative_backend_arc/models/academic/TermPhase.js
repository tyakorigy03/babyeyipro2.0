const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const TermPhase = sequelize.define('TermPhase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  term_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'terms',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g. Orientation Week, Teaching Weeks, Examination Period',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'term_phases',
  timestamps: true,
  underscored: true,
  paranoid: true, // soft delete via deleted_at
});

TermPhase.associate = (models) => {
  TermPhase.belongsTo(models.Term, { foreignKey: 'term_id', as: 'term' });
};

module.exports = TermPhase;
