const { ChatRoom, ChatMessage, GroupMembership, User } = require('../../models');
const { dispatchNotification } = require('../../services/notificationService');

// @desc    Send a message to a ChatRoom (or broadcast)
// @route   POST /api/communication/chat/send
// @access  Protected
const sendMessage = async (req, res) => {
  try {
    const { room_id, content, message_type, attachment_url } = req.body;

    if (!room_id || (!content && !attachment_url)) {
      return res.status(400).json({ message: 'Missing room ID or message content' });
    }

    // 1. Verify the Room exists
    const room = await ChatRoom.findOne({
      where: { id: room_id, school_id: req.user.school_id }
    });

    if (!room || !room.is_active) {
      return res.status(404).json({ message: 'Chat room not found or inactive' });
    }

    // 2. Save the message to the database
    const message = await ChatMessage.create({
      room_id: room.id,
      sender_id: req.user.id,
      content: content || '',
      message_type: message_type || 'Text',
      attachment_url: attachment_url || null,
      is_broadcast: room.type === 'Broadcast'
    });

    // 3. Resolve Target Audience for Push Notifications
    // If it's a dynamic group chat (linked to the Targeting Engine)
    if (room.target_group_id) {
      // Find all active members of this dynamic group
      const members = await GroupMembership.findAll({
        where: { group_id: room.target_group_id, status: 'active' },
        attributes: ['user_id']
      });

      // Dispatch Push Notifications asynchronously to all members (except sender)
      members.forEach(member => {
        if (member.user_id !== req.user.id) {
          dispatchNotification(
            req.user.school_id,
            'Announcement', // Event Type
            'NewMessage',   // Trigger Condition
            member.user_id,
            `New Message in ${room.name}`,
            content ? content.substring(0, 50) + '...' : 'Sent an attachment',
            'ChatMessage',
            message.id
          );
        }
      });
    }

    res.status(201).json({
      status: 'success',
      data: message
    });

  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

module.exports = {
  sendMessage
};
