import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from 'dotenv';

// make sure environment variables are loaded as soon as this module is required
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary configuration in environment variables:', {
        CLOUDINARY_CLOUD_NAME: !!CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: !!CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: !!CLOUDINARY_API_SECRET,
    });
    // Optionally you could throw here to catch misconfiguration early
    // throw new Error('Cloudinary environment variables are not set');
}

cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File uploaded successfully on Cloudinary. URL: "+response.url); 
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        try {
            fs.unlinkSync(localFilePath);
        } catch (deleteError) {
            console.error("Error deleting local file:", deleteError);
        }
        return null; 
    }
}
export {uploadOnCloudinary}


