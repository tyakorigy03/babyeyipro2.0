const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../models');

// @desc    Bulk Import CSV Data to a specific Model
// @route   POST /api/import/:resource
// @access  Protected
const bulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const resourceName = req.params.resource;
    let modelName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
    if (modelName.endsWith('s')) modelName = modelName.slice(0, -1);
    
    // Exception mapping logic identical to genericRoutes
    const exceptions = { 'Classes': 'Class', 'Categories': 'FeeCategory' };
    if (exceptions[modelName + 's']) modelName = exceptions[modelName + 's'];

    const Model = db[modelName];
    if (!Model) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(404).json({ message: `Model '${modelName}' not found.` });
    }

    const results = [];
    
    // Parse the CSV File
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Enforce Multi-Tenancy for every single row injected
        data.school_id = req.user.school_id;
        results.push(data);
      })
      .on('end', async () => {
        try {
          // Bulk Insert into Database
          // We don't use a transaction here to avoid locking the table for too long if the file is massive
          // but we use ignoreDuplicates/updateOnDuplicate depending on dialect.
          await Model.bulkCreate(results, { 
             validate: true,
             // updateOnDuplicate: ['id'] // Could be configured based on model primary keys
          });

          // Clean up the temporary CSV file
          fs.unlinkSync(req.file.path);

          res.status(201).json({
            status: 'success',
            message: `Successfully imported ${results.length} records into ${modelName}.`
          });
        } catch (dbError) {
          console.error('Bulk Insert Error:', dbError);
          fs.unlinkSync(req.file.path);
          res.status(400).json({ message: 'Database validation failed during import', details: dbError.message });
        }
      });

  } catch (error) {
    console.error('CSV Processing Error:', error);
    res.status(500).json({ message: 'Server error processing CSV file' });
  }
};

module.exports = {
  bulkImport
};
