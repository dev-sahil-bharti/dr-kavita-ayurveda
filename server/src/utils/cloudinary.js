const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file stream to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer to upload (from Multer memory storage).
 * @param {String} folder - The Cloudinary folder to store the file in.
 * @param {String} resourceType - The resource type (e.g., 'image', 'raw' for documents, 'auto').
 * @returns {Promise<Object>} - A promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (fileBuffer, folder = 'dr-kavita-ayurveda/appointments', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes a file from Cloudinary (used for cleanup on failure).
 * @param {String} publicId - The Cloudinary asset public ID.
 * @param {String} resourceType - The Cloudinary resource type ('image', 'raw', etc.).
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`⚠️ Failed to delete Cloudinary asset ${publicId}:`, err.message);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary,
};
