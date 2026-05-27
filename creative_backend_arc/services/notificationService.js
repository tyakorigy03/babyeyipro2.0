const { NotificationPolicy, UserNotificationPreference, Notification, User } = require('../models');

// Mock external APIs for demonstration
const externalAPIs = {
  sendPush: async (userId, title, content) => {
    console.log(`[PUSH API] Sent to User ${userId}: ${title}`);
    return true; // Simulate success
  },
  sendWhatsApp: async (phone, content) => {
    console.log(`[WHATSAPP API] Sent to ${phone}: ${content}`);
    return true; 
  },
  sendSMS: async (phone, content) => {
    console.log(`[SMS API] Sent to ${phone}: ${content}`);
    return true;
  }
};

/**
 * The Smart Routing Engine for Notifications
 * @param {string} school_id 
 * @param {string} event_type - e.g., 'Attendance', 'FeePayment'
 * @param {string} trigger_condition - e.g., 'CheckIn', 'Overdue'
 * @param {string} user_id - The recipient
 * @param {string} title 
 * @param {string} content 
 * @param {string} reference_type 
 * @param {string} reference_id 
 */
const dispatchNotification = async (school_id, event_type, trigger_condition, user_id, title, content, reference_type = null, reference_id = null) => {
  try {
    // 1. Check School Policy
    const policy = await NotificationPolicy.findOne({
      where: { school_id, event_type, trigger_condition }
    });

    // If no policy exists, or it's disabled, abort silently (School doesn't want this alert sent)
    if (!policy || !policy.is_enabled) {
      return { status: 'skipped', reason: 'School policy disabled' };
    }

    // 2. Fetch User & Preferences
    const user = await User.findByPk(user_id);
    if (!user) return { status: 'failed', reason: 'User not found' };

    const prefs = await UserNotificationPreference.findOne({ where: { user_id } });
    
    // Check Quiet Hours (Simplified check for demonstration)
    if (prefs && prefs.is_muted) {
      return { status: 'skipped', reason: 'User globally muted notifications' };
    }

    // 3. Determine Routing Channel (Smart Routing)
    // Default to policy channels if user has no prefs, or fallback to 'App'
    let channelsToTry = prefs && prefs.channel_priority ? prefs.channel_priority : 
                        (policy.default_channels || ['App']);

    let channelUsed = null;
    let deliverySuccess = false;

    for (const channel of channelsToTry) {
      try {
        if (channel === 'App') {
          deliverySuccess = await externalAPIs.sendPush(user_id, title, content);
        } else if (channel === 'WhatsApp' && user.phone) {
          deliverySuccess = await externalAPIs.sendWhatsApp(user.phone, content);
        } else if (channel === 'SMS' && user.phone) {
          deliverySuccess = await externalAPIs.sendSMS(user.phone, content);
        }

        if (deliverySuccess) {
          channelUsed = channel;
          break; // Stop trying other channels once one succeeds!
        }
      } catch (err) {
        console.error(`Failed to send via ${channel}`, err);
        // Continue to the next fallback channel
      }
    }

    if (!channelUsed) {
      return { status: 'failed', reason: 'All channels failed or missing contact info' };
    }

    // 4. Log the Notification for Audit
    await Notification.create({
      school_id,
      user_id,
      title,
      content,
      channel_used: channelUsed,
      status: 'Sent',
      reference_type,
      reference_id
    });

    return { status: 'success', channel: channelUsed };

  } catch (error) {
    console.error('Notification Service Error:', error);
    return { status: 'error', reason: error.message };
  }
};

module.exports = {
  dispatchNotification
};
