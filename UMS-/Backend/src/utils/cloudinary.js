import { v2 as cloudinary } from 'cloudinary';      // // import { Cloudinary } from '@cloudinary/url-gen'; // for generating URLs
import fs from "fs";                                // // file system (included in node.js)


    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, 
            {
                resource_type: "auto"
            }) 
        //File has been uploaded successfully
        // console.log("File is uploaded successfully on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary files as the upload operation fails...
        return null;
    }
}

const deleteFileFromCloudinary = async (publicId) => {
    try {
      if (!publicId) return null;
      const response = await cloudinary.uploader.destroy(publicId);
      return response;
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error.message);
      return null;
    }
  };

export {uploadOnCloudinary, deleteFileFromCloudinary}