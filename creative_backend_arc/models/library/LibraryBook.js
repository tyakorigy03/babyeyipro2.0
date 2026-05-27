const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const LibraryBook = sequelize.define('LibraryBook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  inventory_item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'inventory_items',
      key: 'id',
    },
    comment: 'Links to the main school inventory for stock control',
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  edition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shelf_location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "e.g. 'A-12' or 'Science Section'",
  },
  status: {
    type: DataTypes.ENUM('Available', 'Borrowed', 'Lost', 'Damaged', 'Reserved'),
    defaultValue: 'Available',
  },
}, {
  tableName: 'library_books',
  timestamps: true,
  underscored: true,
});

LibraryBook.associate = (models) => {
  LibraryBook.belongsTo(models.InventoryItem, { foreignKey: 'inventory_item_id', as: 'inventoryDetails' });
  LibraryBook.hasMany(models.LibraryLoan, { foreignKey: 'book_id', as: 'loans' });
};

module.exports = LibraryBook;
