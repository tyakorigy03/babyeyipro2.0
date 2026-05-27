const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
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
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  message_type: {
    type: DataTypes.ENUM('Text', 'Image', 'File', 'Audio', 'Video', 'Location'),
    defaultValue: 'Text',
  },
  attachment_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Link to the Universal Document Vault',
  },
  is_broadcast: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'chat_messages',
  timestamps: true,
  updatedAt: false,
  underscored: true,
});

ChatMessage.associate = (models) => {
  ChatMessage.belongsTo(models.ChatRoom, { foreignKey: 'room_id', as: 'room' });
  ChatMessage.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
};

module.exports = ChatMessage;
