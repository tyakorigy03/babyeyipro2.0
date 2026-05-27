const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const LibraryLoan = sequelize.define('LibraryLoan', {
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
  book_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'library_books',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'The student or staff member borrowing the book',
  },
  smart_card_log_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'smart_card_logs',
      key: 'id',
    },
    comment: "Link to the ShuleCard 'Tap' that initiated this loan",
  },
  loan_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Returned', 'Overdue', 'Lost'),
    defaultValue: 'Active',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'library_loans',
  timestamps: true,
  underscored: true,
});

LibraryLoan.associate = (models) => {
  LibraryLoan.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  LibraryLoan.belongsTo(models.LibraryBook, { foreignKey: 'book_id', as: 'book' });
  LibraryLoan.belongsTo(models.User, { foreignKey: 'user_id', as: 'borrower' });
  LibraryLoan.belongsTo(models.SmartCardLog, { foreignKey: 'smart_card_log_id', as: 'triggerTap' });
  LibraryLoan.hasOne(models.LibraryFine, { foreignKey: 'loan_id', as: 'fine' });
};

module.exports = LibraryLoan;
