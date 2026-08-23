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
const uploadToCloudinary = (fileBuffer, folder = 'dr_kavita', resourceType = 'auto') => {
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

module.exports = {
  uploadToCloudinary,
  cloudinary
};
