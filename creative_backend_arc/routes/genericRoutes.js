const express = require('express');
const router = express.Router();
const factory = require('../controllers/factoryHandler');
const { protect } = require('../middleware/authMiddleware');
const db = require('../models');

// Middleware to dynamically resolve the model based on the URL parameter
const resolveModel = (req, res, next) => {
  const resourceName = req.params.resource;
  
  // Basic plural to singular resolution (e.g. 'students' -> 'Student')
  // This can be expanded into a proper mapping dictionary if table names get complex
  let modelName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  if (modelName.endsWith('s')) {
    modelName = modelName.slice(0, -1);
  }
  
  // Custom plural resolutions (exceptions)
  const exceptions = {
    'Leaves': 'LeaveRequest',
    'Classes': 'Class',
    'Categories': 'FeeCategory',
    'Facilities': 'Location',
    'RoutineActivities': 'RoutineActivity',
    'RoutineTimeSlots': 'RoutineTimeSlot'
    // add more if needed
  };

  if (exceptions[modelName + 's']) {
      modelName = exceptions[modelName + 's'];
  } else if (exceptions[resourceName]) {
      modelName = exceptions[resourceName];
  }

  const Model = db[modelName];

  if (!Model) {
    return res.status(404).json({ message: `Resource '${resourceName}' not found. Model '${modelName}' does not exist.` });
  }

  // Set default include options for complex models
  if (modelName === 'RoutineTemplate') {
    req.includeOptions = [
      {
        model: db.RoutineTimeSlot,
        as: 'timeSlots',
        include: [
          {
            model: db.RoutineActivity,
            as: 'activities',
            include: [
              { model: db.Location, as: 'location' },
              { model: db.Group, as: 'responsibleGroup' },
              { 
                model: db.RoutineActivityTargetGroup, 
                as: 'targetGroups',
                include: [{ model: db.Group, as: 'group' }]
              }
            ]
          }
        ]
      }
    ];
  }

  if (modelName === 'Staff') {
    req.includeOptions = [
      {
        model: db.User,
        as: 'user',
        include: [
          { model: db.Role, as: 'role' },
          {
            model: db.StaffAssignment,
            as: 'assignments',
            include: [{ model: db.OrganizationUnit, as: 'unit' }]
          }
        ]
      },
      {
        model: db.User,
        as: 'reportingToUser'
      }
    ];
  }
  
  if (modelName === 'Student') {
    req.includeOptions = [
      {
        model: db.Parent,
        as: 'parents',
        through: { attributes: [] }
      }
    ];
  }

  if (modelName === 'Parent') {
    req.includeOptions = [
      {
        model: db.Student,
        as: 'students',
        through: { attributes: [] }
      },
      {
        model: db.User,
        as: 'user'
      }
    ];
  }

  req.Model = Model;
  next();
};

const { upload } = require('../middleware/uploadMiddleware');

// Apply protection to all generic routes
router.use(protect);

// Dynamic Route Handlers
// We inject upload.any() to seamlessly support multipart/form-data (file uploads) 
// for ANY model that requires an image or file (e.g. Student.photo_url, School.logo_url)
router.route('/:resource')
  .get(resolveModel, (req, res, next) => factory.getAll(req.Model)(req, res, next))
  .post(resolveModel, upload.any(), (req, res, next) => factory.createOne(req.Model)(req, res, next));

router.route('/:resource/:id')
  .get(resolveModel, (req, res, next) => factory.getOne(req.Model)(req, res, next))
  .patch(resolveModel, upload.any(), (req, res, next) => factory.updateOne(req.Model)(req, res, next))
  .delete(resolveModel, (req, res, next) => factory.deleteOne(req.Model)(req, res, next));

module.exports = router;
