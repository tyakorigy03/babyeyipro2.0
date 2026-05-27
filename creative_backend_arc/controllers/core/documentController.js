const { Document, DocumentType } = require('../../models');

// @desc    Upload a single file and link it to an entity (The Vault)
// @route   POST /api/documents/upload
// @access  Protected
const uploadDocument = async (req, res) => {
  try {
    // 1. Check if file exists in the request
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { document_type_id, owner_type, owner_id, title, expiry_date, metadata } = req.body;

    // 2. Validate required metadata
    if (!document_type_id || !owner_type || !owner_id || !title) {
      return res.status(400).json({ 
        message: 'Missing required fields: document_type_id, owner_type, owner_id, title' 
      });
    }

    // 3. Verify Document Type exists
    const docType = await DocumentType.findOne({
      where: { id: document_type_id, school_id: req.user.school_id }
    });

    if (!docType) {
      return res.status(404).json({ message: 'Document Type not found' });
    }

    // 4. Construct the file URL (Relative path to be served statically)
    // The filename was generated securely by Multer
    const fileUrl = `/uploads/${req.file.filename}`;

    // 5. Save the record in the Document Vault
    const document = await Document.create({
      school_id: req.user.school_id,
      document_type_id,
      owner_type,
      owner_id,
      title,
      file_url: fileUrl,
      expiry_date: expiry_date || null,
      status: 'Active',
      metadata: metadata ? JSON.parse(metadata) : {}
    });

    res.status(201).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: document
    });

  } catch (error) {
    console.error('Document Upload Error:', error);
    res.status(500).json({ message: 'Server error during document upload' });
  }
};

module.exports = {
  uploadDocument
};
