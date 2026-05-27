const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ChatParticipant = sequelize.define('ChatParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'chat_rooms',
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
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Member'),
    defaultValue: 'Member',
  },
  last_read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chat_participants',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['room_id', 'user_id'],
    },
  ],
});

ChatParticipant.associate = (models) => {
  ChatParticipant.belongsTo(models.ChatRoom, { foreignKey: 'room_id', as: 'room' });
  ChatParticipant.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = ChatParticipant;
