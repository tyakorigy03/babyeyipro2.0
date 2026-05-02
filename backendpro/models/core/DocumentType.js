const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const DocumentType = sequelize.define('DocumentType', {
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
    comment: "e.g. 'National ID', 'Contract', 'Medical Report'",
  },
  category: {
    type: DataTypes.ENUM('Identity', 'Academic', 'Employment', 'Legal', 'Medical', 'Other'),
    defaultValue: 'Other',
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'document_types',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

DocumentType.associate = (models) => {
  DocumentType.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  DocumentType.hasMany(models.Document, { foreignKey: 'document_type_id', as: 'documents' });
};

module.exports = DocumentType;
