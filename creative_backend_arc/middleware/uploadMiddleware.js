const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// 1. Configure Local Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: UUID + original extension
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// 2. File Filter — compatible with Multer v2 + Express 5
//
// ⚠️  MULTER v2 BREAKING CHANGE:
//    Calling cb(new Error()) in fileFilter no longer propagates to Express next().
//    It causes an unhandled exception → instant 500 with no SQL logged.
//    Fix: use cb(null, false) to silently reject, then tag req so the route
//    handler can return a proper 400 response.
const fileFilter = (req, file, cb) => {
  // Accept any image MIME type (jpeg, png, webp, gif, svg, etc.)
  const isImage = file.mimetype.startsWith('image/');
  // Accept common document types for other upload endpoints
  const isDoc = /pdf|msword|officedocument|csv|excel|sheet/i.test(file.mimetype);

  if (isImage || isDoc) {
    cb(null, true);
  } else {
    // Do NOT call cb(new Error()) — it breaks in Multer v2 + Express 5
    req.fileRejected = true;
    req.fileRejectedReason = `File type not allowed: ${file.mimetype}`;
    cb(null, false);
  }
};

// 3. Initialize Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

// 4. ✅ Promise-wrapped middleware — use this in routes instead of upload.any() directly
//
// Why: In Multer v2 + Express 5, calling upload.any() inline can throw errors
// that bypass the Express error handler. Wrapping it in a callback guarantees
// all Multer errors (size limit exceeded, storage failures, etc.) are forwarded
// to next(err) and handled by the global errorHandler.
const multerMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      // Forward Multer errors (file too large, storage error, etc.)
      return next(err);
    }
    // If fileFilter silently rejected a file, return a clean 400
    if (req.fileRejected) {
      return res.status(400).json({ message: req.fileRejectedReason });
    }
    next();
  });
};

module.exports = {
  upload,
  multerMiddleware,
};
