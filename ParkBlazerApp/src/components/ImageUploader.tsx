// src/components/ImageUploader.tsx
import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/CloudinaryUploader';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (imageFile) {
      try {
        const url = await uploadImageToCloudinary(imageFile);
        setImageUrl(url);
        onUploadComplete(url)
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Bild hochladen</button>
      {imageUrl && (
        <p>Bild hochgeladen.</p>
      )}
    </div>
  );
};

export default ImageUploader;
