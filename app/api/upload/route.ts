import {v2 as cloudinary} from 'next-cloudinary';

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(file.buffer);
  });
};
