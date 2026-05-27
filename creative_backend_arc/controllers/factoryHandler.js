const { Op } = require('sequelize');
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const saveStudentRelations = async (doc, body, user) => {
  const db = require('../models');
  
  // 1. Resolve and Save Parent Associations (student_parents join table)
  let parentIds = [];
  const familyMembers = body.family_members || [];
  const directParent = body.parent;
  
  const parentIdentifiers = [];
  if (directParent) parentIdentifiers.push(directParent);
  familyMembers.forEach(m => {
    if (m && m.parent) parentIdentifiers.push(m.parent);
  });
  
  if (parentIdentifiers.length > 0) {
    for (const identifier of parentIdentifiers) {
      if (!identifier || identifier === 'N/A') continue;
      
      let parent = null;
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier) || 
                     (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier));
      if (isUUID) {
        parent = await db.Parent.findOne({ where: { id: identifier, school_id: user.school_id } });
      } else {
        parent = await db.Parent.findOne({
          where: { full_name: identifier, school_id: user.school_id }
        });
      }
      if (parent) {
        parentIds.push(parent.id);
      }
    }
  }
  
  if (parentIds.length > 0) {
    await doc.setParents(parentIds);
  }

  // 2. Resolve and Save Class Enrollments
  const className = body.class;
  const academicYearName = body.academicYear || body.academic_year || '2024-2025';
  
  if (className && className !== 'N/A') {
    let cls = null;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(className) ||
                   (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(className));
    if (isUUID) {
      cls = await db.Class.findOne({ where: { id: className, school_id: user.school_id } });
    } else {
      cls = await db.Class.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { custom_name: className },
            { stream: className }
          ],
          school_id: user.school_id
        }
      });
    }
    
    if (cls) {
      let year = await db.AcademicYear.findOne({
        where: { name: academicYearName, school_id: user.school_id }
      });
      if (!year) {
        year = await db.AcademicYear.findOne({
          where: { school_id: user.school_id },
          order: [['created_at', 'DESC']]
        });
      }
      
      if (year) {
        await db.Enrollment.upsert({
          school_id: user.school_id,
          student_id: doc.id,
          class_id: cls.id,
          academic_year_id: year.id,
          status: 'Active',
          promotion_status: 'Pending'
        });
      }
    }
  }
};

const saveParentRelations = async (doc, body, user) => {
  const db = require('../models');
  let studentIds = [];
  
  const students = body.students || [];
  const directStudent = body.student;
  
  const studentIdentifiers = [];
  if (directStudent) studentIdentifiers.push(directStudent);
  if (Array.isArray(students)) {
    students.forEach(s => {
      if (s) studentIdentifiers.push(s);
    });
  }
  
  if (studentIdentifiers.length > 0) {
    for (const identifier of studentIdentifiers) {
      if (!identifier || identifier === 'N/A') continue;
      
      let student = null;
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier) ||
                     (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier));
      if (isUUID) {
        student = await db.Student.findOne({ where: { id: identifier, school_id: user.school_id } });
      } else {
        student = await db.Student.findOne({
          where: {
            [db.Sequelize.Op.or]: [
              { full_name: identifier },
              { student_id_number: identifier }
            ],
            school_id: user.school_id
          }
        });
      }
      if (student) {
        studentIds.push(student.id);
      }
    }
  }
  
  if (studentIds.length > 0) {
    await doc.setStudents(studentIds);
  }
};

const createStudentUser = async (studentData, school_id) => {
  const db = require('../models');
  if (studentData.user_id) return studentData.user_id;

  const idNumber = studentData.student_id_number;
  if (!idNumber) return null;

  const email = `student_${idNumber.replace(/\s+/g, '_')}@school.system`.toLowerCase();

  let existingUser = await db.User.findOne({ where: { email, school_id } });
  if (existingUser) return existingUser.id;

  const newUser = await db.User.create({
    school_id: school_id,
    name: studentData.full_name || 'Student',
    email: email,
    password: idNumber || 'Student@123',
    status: 'active'
  });

  return newUser.id;
};

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1. Find the document
    const doc = await Model.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school_id // Multi-tenant security lock
      }
    });

    if (!doc) {
      return res.status(404).json({ message: 'No document found with that ID' });
    }

    // 2. Delete
    await doc.destroy({ user_id: req.user.id });

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // Strip invalid date values before Sequelize tries to parse them (prevents moment.js crash)
    const DATE_FIELDS = ['dob', 'admission_date', 'date_of_birth', 'start_date', 'end_date'];
    DATE_FIELDS.forEach(field => {
      if (req.body[field] !== undefined) {
        const val = req.body[field];
        if (!val || val === 'N/A' || val === 'Invalid date' || isNaN(Date.parse(val))) {
          delete req.body[field];
        }
      }
    });

    // 1. Ensure users cannot change the school_id
    if (req.body.school_id && req.body.school_id !== req.user.school_id) {
       return res.status(403).json({ message: 'Forbidden: Cannot transfer data to another school' });
    }

    // Process any uploaded files from multipart/form-data
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Map the secure file URL to the corresponding field name in the database
        req.body[file.fieldname] = `/uploads/${file.filename}`;
      });
    }

    // 2. Find, validate, and update
    const doc = await Model.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school_id // Multi-tenant security lock
      }
    });

    if (!doc) {
      return res.status(404).json({ message: 'No document found with that ID' });
    }

    await doc.update(req.body, { user_id: req.user.id });

    // Handle Staff Assignment for Departments & Reporting Manager
    if (Model.name === 'Staff') {
      try {
        const db = require('../models');
        if (req.body.department) {
          const unit = await db.OrganizationUnit.findOne({
            where: {
              name: req.body.department,
              school_id: req.user.school_id
            }
          });
          if (unit) {
            await db.StaffAssignment.destroy({
              where: { user_id: doc.user_id }
            });
            await db.StaffAssignment.create({
              user_id: doc.user_id,
              unit_id: unit.id,
              position_name: doc.designation || 'Staff Member',
              is_primary: true
            });
          }
        }
        if (req.body.reportingTo !== undefined) {
          if (req.body.reportingTo) {
            const managerUser = await db.User.findOne({
              where: {
                name: req.body.reportingTo,
                school_id: req.user.school_id
              }
            });
            if (managerUser) {
              await doc.update({ reporting_to_id: managerUser.id }, { user_id: req.user.id });
            } else {
              await doc.update({ reporting_to_id: null }, { user_id: req.user.id });
            }
          } else {
            await doc.update({ reporting_to_id: null }, { user_id: req.user.id });
          }
        }
      } catch (err) {
        console.error('Error updating Staff relations:', err);
      }
    }

    if (Model.name === 'Student') {
      await saveStudentRelations(doc, req.body, req.user);
    }

    if (Model.name === 'Parent') {
      await saveParentRelations(doc, req.body, req.user);
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // Check if this is a bulk creation request
    const isBulk = Array.isArray(req.body) || (req.body && Array.isArray(req.body.entries));
    const entries = Array.isArray(req.body) ? req.body : (req.body.entries || null);

    if (isBulk && entries) {
      // 1. Inject school_id into all entries
      const bulkData = entries.map(entry => ({
        ...entry,
        school_id: req.user.school_id
      }));

      // 2. Bulk create with Upsert support (updates if date/school_id matches)
      // Note: We use updateOnDuplicate if the DB supports it, or a simple loop if not.
      // For this generic handler, we'll try to find and update or create.
      const docs = await Promise.all(bulkData.map(async (item) => {
        if (Model.name === 'Student') {
          try {
            item.user_id = await createStudentUser(item, req.user.school_id);
          } catch (err) {
            console.error('Error auto-creating student user in bulk:', err);
          }
        }
        const [doc] = await Model.upsert(item, { returning: true });
        
        if (Model.name === 'Student') {
          try {
            await saveStudentRelations(doc, item, req.user);
          } catch (err) {
            console.error('Error saving student relations in bulk:', err);
          }
        }
        return doc;
      }));

      return res.status(201).json({
        status: 'success',
        results: docs.length,
        data: docs
      });
    }

    // --- Standard Single Creation ---
    // Strip invalid date values before Sequelize tries to parse them (prevents moment.js crash)
    const DATE_FIELDS_CREATE = ['dob', 'admission_date', 'date_of_birth', 'start_date', 'end_date'];
    DATE_FIELDS_CREATE.forEach(field => {
      if (req.body[field] !== undefined) {
        const val = req.body[field];
        if (!val || val === 'N/A' || val === 'Invalid date' || isNaN(Date.parse(val))) {
          delete req.body[field];
        }
      }
    });

    // 1. Inject the user's school_id to ensure the data belongs to their tenant
    req.body.school_id = req.user.school_id;

    if (Model.name === 'Student') {
      try {
        req.body.user_id = await createStudentUser(req.body, req.user.school_id);
      } catch (err) {
        console.error('Error auto-creating student user:', err);
      }
    }

    // Process any uploaded files from multipart/form-data
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Map the secure file URL to the corresponding field name in the database
        req.body[file.fieldname] = `/uploads/${file.filename}`;
      });
    }

    // 2. Create the document
    const doc = await Model.create(req.body, { user_id: req.user.id });

    // Handle Staff Assignment for Departments & Reporting Manager
    if (Model.name === 'Staff') {
      try {
        const db = require('../models');
        if (req.body.department) {
          const unit = await db.OrganizationUnit.findOne({
            where: {
              name: req.body.department,
              school_id: req.user.school_id
            }
          });
          if (unit) {
            await db.StaffAssignment.create({
              user_id: doc.user_id,
              unit_id: unit.id,
              position_name: doc.designation || 'Staff Member',
              is_primary: true
            });
          }
        }
        if (req.body.reportingTo) {
          const managerUser = await db.User.findOne({
            where: {
              name: req.body.reportingTo,
              school_id: req.user.school_id
            }
          });
          if (managerUser) {
            await doc.update({ reporting_to_id: managerUser.id }, { user_id: req.user.id });
          }
        }
      } catch (err) {
        console.error('Error creating Staff relations:', err);
      }
    }

    if (Model.name === 'Student') {
      await saveStudentRelations(doc, req.body, req.user);
    }

    if (Model.name === 'Parent') {
      await saveParentRelations(doc, req.body, req.user);
    }

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, includeOptions = []) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.school_id // Multi-tenant security lock
      },
      include: req.includeOptions || includeOptions
    });

    if (!doc) {
      return res.status(404).json({ message: 'No document found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = (Model, includeOptions = []) =>
  catchAsync(async (req, res, next) => {
    // Models that are scoped via parent FK, not directly by school_id
    const noDirectSchoolScope = [
      'Term', 'TermPhase', 'SchoolCalendar', 'AcademicGroup', 'Class', 'Grade',
      'RoutineTimeSlot', 'RoutineActivity'
    ];
    const hasSchoolScope = !noDirectSchoolScope.includes(Model.name);

    // Simple query builder
    let queryOptions = {
      where: hasSchoolScope ? { school_id: req.user.school_id } : {},
      include: req.includeOptions || includeOptions
    };

    // Filter logic (e.g. ?status=active or ?date_from=...)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle range filters (_from, _to)
    Object.keys(queryObj).forEach(key => {
      if (key.endsWith('_from')) {
        const field = key.replace('_from', '');
        queryOptions.where[field] = { [Op.gte]: queryObj[key] };
        delete queryObj[key];
      } else if (key.endsWith('_to')) {
        const field = key.replace('_to', '');
        queryOptions.where[field] = { ...queryOptions.where[field], [Op.lte]: queryObj[key] };
        delete queryObj[key];
      }
    });

    queryOptions.where = { ...queryOptions.where, ...queryObj };

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    // Execute Query
    const { count, rows } = await Model.findAndCountAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: rows.length,
      total: count,
      data: rows
    });
  });
