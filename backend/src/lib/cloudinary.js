import { v2 as cloudinary } from "cloudinary";

/* 
That file is often imported very early — sometimes even before index.js runs your global setup.
If you don’t import and call config() there, process.env.CLOUDINARY_API_KEY might still be 
undefined at the moment this file executes. so we need to import and configure dot env once again
last time we did it inside index.js
*/
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
