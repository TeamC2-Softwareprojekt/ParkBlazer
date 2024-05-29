
import { airplane, bluetooth, call, wifi } from 'ionicons/icons';
import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonInput,
  IonIcon
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';

const Userprofile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Hier können Sie die Logik zum Speichern der Änderungen hinzufügen
    console.log('Saving profile...', { name, email });
    toggleEdit();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="User Avatar" />
            </IonAvatar>
            <IonLabel>
              <h2>{name}</h2>
              <p>{email}</p>
            </IonLabel>
            <IonButton slot="end" onClick={toggleEdit}>
              {isEditing ? 'Cancel' : 'Edit'}
            </IonButton>
          </IonItem>
        </IonList>
        {isEditing && (
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Name</IonLabel>
              <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
            </IonItem>
            <IonButton expand="full" onClick={handleSave}>
              Save
            </IonButton>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Userprofile;
