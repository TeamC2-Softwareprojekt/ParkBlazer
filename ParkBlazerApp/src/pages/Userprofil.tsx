
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
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonThumbnail,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';
// @ts-ignore
import Rating from 'react-rating-stars-component';

import { personCircleOutline } from 'ionicons/icons';

const Userprofile: React.FC = () => {
  
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [adress, setAdress] = useState('Holzstraße 7');
  const [number, setNumber] = useState('0175 120125487');
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);

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
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6" offset-md="3">
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
                    <IonLabel position="stacked">Firstname</IonLabel>
                    <IonInput value={firstName} onIonChange={(e) => setFirstName(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Lastname</IonLabel>
                    <IonInput value={lastName} onIonChange={(e) => setLastName(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Address</IonLabel>
                    <IonInput value={adress} onIonChange={(e) => setAdress(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Number</IonLabel>
                    <IonInput value={number} onIonChange={(e) => setNumber(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonButton expand="full" onClick={handleSave}>
                    Save
                  </IonButton>
                </IonList>
              )}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="8" size-md="3" offset-md="8">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Liste der angelegten Parkplätze</IonCardTitle>
                  <IonCardSubtitle>John Doe</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonThumbnail slot="start">
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                      </IonThumbnail>
                      <IonLabel>Parkplatz 1</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonThumbnail slot="start">
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                      </IonThumbnail>
                      <IonLabel>Parkplatz 2</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonThumbnail slot="start">
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                      </IonThumbnail>
                      <IonLabel>Parkplatz 3</IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonThumbnail slot="start">
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                      </IonThumbnail>
                      <IonLabel>Parkplatz 4</IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          {/* Bewertungskomponente */}
          <IonRow>
            <IonCol size="12">
              <Rating
                count={5}
                size={30}
                activeColor="#ffd700"
                isHalf={false}
                value={rating}
                onChange={(newValue: React.SetStateAction<number>) => setRating(newValue)}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Userprofile;
