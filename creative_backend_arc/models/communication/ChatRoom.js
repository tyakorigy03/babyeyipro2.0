const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ChatRoom = sequelize.define('ChatRoom', {
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
    allowNull: true,
    comment: 'Name for group chats (e.g. S1 Parents)',
  },
  type: {
    type: DataTypes.ENUM('Individual', 'Group', 'Broadcast', 'System'),
    defaultValue: 'Individual',
  },
  target_group_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
    comment: 'Dynamically links chat membership to the Targeting Engine',
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'chat_rooms',
  timestamps: true,
  underscored: true,
});

ChatRoom.associate = (models) => {
  ChatRoom.belongsTo(models.School, { foreignKey: 'school_id', as: 'school' });
  ChatRoom.belongsTo(models.Group, { foreignKey: 'target_group_id', as: 'targetGroup' });
  ChatRoom.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  ChatRoom.hasMany(models.ChatParticipant, { foreignKey: 'room_id', as: 'participants' });
  ChatRoom.hasMany(models.ChatMessage, { foreignKey: 'room_id', as: 'messages' });
};

module.exports = ChatRoom;
