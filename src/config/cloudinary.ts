import cloudinary from 'cloudinary';

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME as string;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET  as string;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
