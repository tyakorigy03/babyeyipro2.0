const express = require('express');
const router = express.Router();
const { School } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../middleware/uploadMiddleware');
const catchAsync = fn => (req, res, next) => fn(req, res, next).catch(next);

// GET School Profile
// This handles the specialized "/api/school/profile/:id" endpoint
router.get('/profile/:id', protect, catchAsync(async (req, res) => {
  const { id } = req.params;
  
  let school;
  
  if (id === 'system') {
    // If 'system' is requested, we try to find the 'Babyeyi System' record 
    // or simply the first record if none exists.
    school = await School.findOne({ 
      where: { code: 'BABYEYI-001' } 
    }) || await School.findOne();
  } else {
    school = await School.findByPk(id);
  }

  if (!school) {
    return res.status(404).json({ message: 'School profile not found' });
  }

  res.status(200).json(school);
}));

// UPDATE School Profile
router.put('/profile/:id', protect, multerMiddleware, catchAsync(async (req, res) => {
  const { id } = req.params;
  
  let school;
  if (id === 'system') {
    school = await School.findOne({ where: { code: 'BABYEYI-001' } }) || await School.findOne();
  } else {
    school = await School.findByPk(id);
  }

  if (!school) {
    return res.status(404).json({ message: 'School profile not found' });
  }

  // Process any uploaded files — inject file path back into body
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      req.body[file.fieldname] = `/uploads/${file.filename}`;
    });
  }

  // Whitelist only the fields the School model owns.
  // This prevents unknown FormData keys from crashing Sequelize validation.
  const ALLOWED_FIELDS = [
    'name', 'motto', 'website', 'founded',
    'email', 'phone', 'address', 'logo_url',
    'organization_type', 'status',
  ];

  const updatePayload = {};
  ALLOWED_FIELDS.forEach(field => {
    if (req.body[field] !== undefined) {
      // Convert empty strings to null so DB optional fields don't fail NOT NULL
      updatePayload[field] = req.body[field] === '' ? null : req.body[field];
    }
  });

  await school.update(updatePayload);
  res.status(200).json(school);
}));

// GET Users by School
router.get('/users/:orgId', protect, catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const { User } = require('../models');
  
  let schoolId = orgId;
  if (orgId === 'system') {
    const systemSchool = await School.findOne({ where: { code: 'BABYEYI-001' } }) || await School.findOne();
    schoolId = systemSchool ? systemSchool.id : null;
  }

  const users = await User.findAll({
    where: { school_id: schoolId }
  });

  res.status(200).json(users);
}));

// GET Roles by School
router.get('/roles/:orgId', protect, catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const { Role } = require('../models');
  
  let schoolId = orgId;
  if (orgId === 'system') {
    const systemSchool = await School.findOne({ where: { code: 'BABYEYI-001' } }) || await School.findOne();
    schoolId = systemSchool ? systemSchool.id : null;
  }

  const roles = await Role.findAll({
    where: { school_id: schoolId },
    include: [{
      model: require('../models').Permission,
      as: 'permissions',
      attributes: ['id', 'name', 'module', 'description'],
      through: { attributes: [] } // don't need the join table attributes
    }]
  });

  res.status(200).json(roles);
}));

// GET All System Permissions (grouped by module in frontend)
router.get('/permissions/all', protect, catchAsync(async (req, res) => {
  const { Permission } = require('../models');
  const permissions = await Permission.findAll();
  res.status(200).json(permissions);
}));

// UPDATE Role Permissions
router.put('/roles/:roleId/permissions', protect, catchAsync(async (req, res) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  const { Role } = require('../models');

  const role = await Role.findByPk(roleId);
  if (!role) {
    return res.status(404).json({ message: 'Role not found' });
  }

  // Set permissions replaces existing associations
  await role.setPermissions(permissionIds);

  res.status(200).json({ message: 'Permissions updated successfully' });
}));

module.exports = router;
