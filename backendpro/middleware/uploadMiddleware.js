const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// 1. Configure Local Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwriting: UUID + Original Extension
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// 2. Configure File Filter (Security)
const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Invalid file type! Only Images, PDFs, and Office Documents are allowed.'));
  }
};

// 3. Initialize Upload Object
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit to prevent abuse
  fileFilter: fileFilter
});

module.exports = {
  upload
};
