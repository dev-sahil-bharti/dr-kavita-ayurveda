const { uploadToCloudinary } = require('../utils/cloudinary');
const AppError = require('../utils/AppError');

/**
 * Controller to handle file uploads to Cloudinary
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file provided for upload', 400));
    }

    // Determine the resource type based on mime type
    // Images are 'image', everything else (like pdfs) can use 'auto' or 'raw'
    let resourceType = 'auto';
    if (req.file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (req.file.mimetype === 'application/pdf') {
      resourceType = 'image'; // Cloudinary can treat pdf as image (to generate thumbnails) or raw
      // Actually, standard practice for Cloudinary is 'raw' or 'auto' for documents
      resourceType = 'auto'; 
    }

    // Pass the file buffer to our utility
    const result = await uploadToCloudinary(req.file.buffer, 'dr_kavita_uploads', resourceType);

    // Return the secure URL and public ID
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
      }
    });

  } catch (error) {
    next(new AppError(`File upload failed: ${error.message}`, 500));
  }
};

module.exports = {
  uploadFile
};
