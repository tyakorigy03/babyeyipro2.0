const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Document = sequelize.define('Document', {
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
  document_type_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'document_types',
      key: 'id',
    },
  },
  owner_type: {
    type: DataTypes.ENUM('Staff', 'Student', 'School', 'Parent'),
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'The ID of the Staff, Student, etc. who owns this document',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Expired', 'Revoked', 'Pending_Review'),
    defaultValue: 'Active',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'documents',
  timestamps: true,
  underscored: true,
});

Document.associate = (models) => {
  Document.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  Document.belongsTo(models.DocumentType, { foreignKey: 'document_type_id', as: 'type' });

  // Polymorphic-style associations can be handled at the service level
  // or via unconstrained belongsTo if needed.
};

module.exports = Document;
