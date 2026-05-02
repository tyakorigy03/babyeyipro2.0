const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SmartCardReader = sequelize.define('SmartCardReader', {
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
  reader_serial: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Hardware Serial Number of the RFID/NFC reader',
  },
  location_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. 'Main Gate', 'Bus 01', 'Class 4A'",
  },
  reader_type: {
    type: DataTypes.ENUM('Gate', 'Classroom', 'Bus', 'Library', 'Canteen', 'Generic'),
    defaultValue: 'Generic',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'smart_card_readers',
  timestamps: true,
  underscored: true,
});

SmartCardReader.associate = (models) => {
  SmartCardReader.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  SmartCardReader.hasMany(models.SmartCardLog, { foreignKey: 'reader_id', as: 'logs' });
};

module.exports = SmartCardReader;
