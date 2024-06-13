import React from 'react';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage } from '@ionic/react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  image: FileList;
  caption: string;
};

const UploadImagePage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('image', data.image[0]);
      formData.append('caption', data.caption);

      // Send formData to server for image upload
      const response = await fetch('https://server-y2mz.onrender.com/upload_image', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      console.log('Image uploaded successfully:', responseData.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="stacked">Image</IonLabel>
            <input type="file" {...register('image', { required: 'Image is required' })} />
            {errors.image && <span>{errors.image.message}</span>}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Caption</IonLabel>
            <IonInput type="text" {...register('caption')} />
          </IonItem>
          <IonButton type="submit">Upload</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default UploadImagePage;
