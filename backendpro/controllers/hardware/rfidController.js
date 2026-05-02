const { SmartCard, SmartCardReader, SmartCardLog, User, AttendanceRecord, WalletTransaction, Wallet } = require('../../models');

// @desc    Process a raw RFID tap from a hardware reader
// @route   POST /api/hardware/rfid/tap
// @access  Protected (Requires Device Token/Auth)
const processTap = async (req, res) => {
  try {
    const { card_number, reader_serial, metadata } = req.body;

    if (!card_number || !reader_serial) {
      return res.status(400).json({ message: 'Missing card number or reader serial' });
    }

    // 1. Authenticate the Reader Hardware
    const reader = await SmartCardReader.findOne({ where: { reader_serial } });
    if (!reader || !reader.is_active) {
      return res.status(401).json({ message: 'Unauthorized or inactive reader device' });
    }

    // 2. Identify the SmartCard & User
    const card = await SmartCard.findOne({ 
      where: { card_number, school_id: reader.school_id },
      include: [{ model: User, as: 'user' }]
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not registered to this school' });
    }

    if (card.status !== 'Active') {
      return res.status(403).json({ message: `Card is ${card.status}` });
    }

    // 3. Determine Action based on Reader Type
    let actionType = 'Attendance';
    let attendanceRecordId = null;

    if (reader.reader_type === 'Gate' || reader.reader_type === 'Bus' || reader.reader_type === 'Classroom') {
      actionType = reader.reader_type === 'Gate' ? 'CheckIn' : 'Attendance';
      
      // TODO: Create Attendance Session if it doesn't exist for today, then log record
      // For now, we simulate the attendance record generation
      const attendance = await AttendanceRecord.create({
          session_id: 'dummy-session-id', // In reality, resolve the active session
          user_id: card.user_id,
          status: 'present',
          recording_method: 'nfc',
          metadata: { reader_location: reader.location_name, ...metadata }
      }).catch(() => null); // Catch foreign key error for dummy session

      if(attendance) attendanceRecordId = attendance.id;

    } else if (reader.reader_type === 'Canteen') {
      actionType = 'Payment';
      // Payment Logic handled via WalletController or specialized pipeline
      // We just log the tap here as a 'Verify' action for now.
    }

    // 4. Log the raw tap in the central ledger
    const log = await SmartCardLog.create({
      school_id: reader.school_id,
      card_id: card.id,
      reader_id: reader.id,
      action_type: actionType,
      metadata: metadata || {},
      attendance_record_id: attendanceRecordId
    });

    // 5. Send Real-Time Feedback to Hardware (e.g. Green Light, Beep)
    res.status(200).json({
      status: 'success',
      action: actionType,
      user: {
        name: card.user.name,
        role_id: card.user.role_id
      },
      message: 'Tap registered successfully'
    });

  } catch (error) {
    console.error('RFID Processing Error:', error);
    res.status(500).json({ message: 'Internal server error processing hardware tap' });
  }
};

module.exports = {
  processTap
};
