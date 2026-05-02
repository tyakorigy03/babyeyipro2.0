const { sequelize } = require('../../config/database');
const { Enrollment, Student, Class, AcademicYear } = require('../../models');
const { Op } = require('sequelize');

// @desc    Execute the End-of-Year Promotion Job
// @route   POST /api/academic/enrollments/promote
// @access  Protected (Requires High Admin Privileges)
const executePromotionJob = async (req, res) => {
  const { current_academic_year_id, next_academic_year_id, class_mapping } = req.body;
  // class_mapping example: { "old_class_id_1": "new_class_id_2" }

  if (!current_academic_year_id || !next_academic_year_id || !class_mapping) {
    return res.status(400).json({ message: 'Missing required promotion parameters' });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Fetch all students in the current year who passed
    const passedEnrollments = await Enrollment.findAll({
      where: {
        school_id: req.user.school_id,
        academic_year_id: current_academic_year_id,
        promotion_decision: 'Pass',
        promotion_status: 'Pending' // Only promote those who haven't been promoted yet
      },
      transaction: t
    });

    if (passedEnrollments.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No pending passed students found for this academic year' });
    }

    let promotedCount = 0;
    const newEnrollmentsData = [];

    // 2. Prepare the new enrollment records based on the class mapping
    for (const enrollment of passedEnrollments) {
      const targetClassId = class_mapping[enrollment.class_id];
      
      if (targetClassId) {
        newEnrollmentsData.push({
          school_id: req.user.school_id,
          student_id: enrollment.student_id,
          class_id: targetClassId,
          academic_year_id: next_academic_year_id,
          status: 'Active',
          promotion_status: 'Pending',
          promotion_decision: 'Incomplete'
        });

        // Mark the old enrollment as Promoted
        enrollment.promotion_status = 'Promoted';
        await enrollment.save({ transaction: t });
        promotedCount++;
      }
      // If there's no mapping (e.g. S6 graduating), we might handle 'Graduated' status separately
    }

    // 3. Bulk insert the new enrollments
    if (newEnrollmentsData.length > 0) {
      await Enrollment.bulkCreate(newEnrollmentsData, { transaction: t });
    }

    // 4. Commit the mass promotion
    await t.commit();

    res.status(200).json({
      status: 'success',
      message: `Successfully promoted ${promotedCount} students to the new academic year.`,
      promoted_count: promotedCount
    });

  } catch (error) {
    await t.rollback();
    console.error('Promotion Job Error:', error);
    res.status(500).json({ message: 'Failed to execute promotion job safely. Rolled back.' });
  }
};

module.exports = {
  executePromotionJob
};
