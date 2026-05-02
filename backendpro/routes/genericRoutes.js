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
