// backendpro/controllers/factoryHandler.js

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
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
    await doc.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
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

    // 2. Find and update
    const [updatedRowsCount, updatedRows] = await Model.update(req.body, {
      where: {
        id: req.params.id,
        school_id: req.user.school_id // Multi-tenant security lock
      },
      returning: true, // Specific to PostgreSQL, but for MySQL we might need to fetch again
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'No document found with that ID' });
    }

    // For MySQL (which doesn't support returning: true elegantly), we refetch
    const updatedDoc = await Model.findOne({
        where: { id: req.params.id }
    });

    res.status(200).json({
      status: 'success',
      data: updatedDoc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1. Inject the user's school_id to ensure the data belongs to their tenant
    req.body.school_id = req.user.school_id;

    // Process any uploaded files from multipart/form-data
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Map the secure file URL to the corresponding field name in the database
        req.body[file.fieldname] = `/uploads/${file.filename}`;
      });
    }

    // 2. Create the document
    const doc = await Model.create(req.body);

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
      include: includeOptions
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
    // Simple query builder
    let queryOptions = {
      where: {
        school_id: req.user.school_id // Multi-tenant security lock
      },
      include: includeOptions
    };

    // Filter logic (e.g. ?status=active)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

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
