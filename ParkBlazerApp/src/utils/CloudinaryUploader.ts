// src/utils/cloudinaryUploader.ts
import axios from 'axios';

export const uploadImageToCloudinary = async (imageFile: File): Promise<string> => {
  const cloudName = 'dgxcyp1hg';
  const uploadPreset = 'ml_default';

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
