import React, { useState, useRef } from 'react';
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
  IonImg,
  IonFab,
  IonFabButton,
  IonModal,
  IonRange,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonRow,
  IonThumbnail
} from '@ionic/react';
import { camera } from 'ionicons/icons';
// @ts-ignore
import Rating from 'react-rating-stars-component';

const Userprofile: React.FC = () => {
  // States for user profile details
  const [isEditing, setIsEditing] = useState(false); // Toggle editing mode
  const [name, setName] = useState('John Doe'); // User's name
  const [email, setEmail] = useState('john.doe@example.com'); // User's email
  const [phoneNumber, setPhoneNumber] = useState(''); // User's phone number
  const [firstName, setFirstName] = useState(''); // User's first name
  const [lastName, setLastName] = useState(''); // User's last name
  const [address, setAddress] = useState(''); // User's address
  const [profileImage, setProfileImage] = useState<string | null>(null); // User's profile image URL
  const [showEditButton, setShowEditButton] = useState(false); // Toggle edit button visibility
  const [showModal, setShowModal] = useState(false); // Toggle modal visibility for image scaling
  const [scaledImage, setScaledImage] = useState<string | null>(null); // Scaled profile image
  const [scale, setScale] = useState(1); // Scale factor for the image
  const [rating, setRating] = useState(0);

  // Reference to file input element
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Toggle editing mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action
  const handleSave = () => {
    // Save logic can be added here
    console.log('Saving profile...', { name, email, phoneNumber, firstName, lastName, address, profileImage });
    toggleEdit();
  };

  // Handle file input change (selecting a new profile image)
  const handleFileInputChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result.toString());
          setScaledImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle click on profile image (to trigger file input click)
  const handleImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  // Handle save action in the modal for image scaling
  const handleModalSave = () => {
    setProfileImage(scaledImage);
    setShowModal(false);
  };

  // Handle scale change in the modal for image scaling
  const handleScaleChange = (e: CustomEvent) => {
    const value = e.detail.value as number;
    setScale(value);
    if (scaledImage) {
      const img = new Image();
      img.src = scaledImage;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width * value;
          canvas.height = img.height * value;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setScaledImage(canvas.toDataURL('image/jpeg'));
        }
      };
    }
  };

  // Handle closing the image scaling modal
  const handleModalClose = () => {
    setScaledImage(profileImage); // Reset to original image
    setScale(1); // Reset scale factor
    setShowModal(false); // Close modal
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            position: 'relative',
            cursor: 'pointer'
          }}
          onMouseEnter={() => setShowEditButton(true)}
          onMouseLeave={() => setShowEditButton(false)}
        >
          <IonAvatar
            style={{
              width: '150px',
              height: '150px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '50%',
              filter: showEditButton ? 'grayscale(90%)' : 'none'
            }}
            onClick={handleImageClick}
          >
            {profileImage ? (
              <IonImg src={profileImage} alt="Profile Avatar" />
            ) : (
              <img
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                alt="User Avatar"
              />
            )}
            {showEditButton && (
              <IonFab
                vertical="bottom"
                horizontal="end"
                slot="end"
                style={{
                  zIndex: 100,
                  position: 'absolute',
                  transform: 'translate(50%, 50%)',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.4)'
                }}
              >
                <IonFabButton
                  onClick={handleImageClick}
                  style={{ borderRadius: '50%' }}
                >
                  <IonIcon icon={camera} />
                </IonFabButton>
              </IonFab>
            )}
          </IonAvatar>
          <h2>{name}</h2>
          <p>{email}</p>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={imageInputRef}
            onChange={(e) => handleFileInputChange(e.target.files)}
          />
        </div>
        {/* Bewertungskomponente */}
        <IonRow>
            <IonCol offsetLg='6'>
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
        <IonRow>
        <IonCol size="2" size-md="5" offset-md="2">
        <IonList >
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={name}
              readonly={!isEditing}
              onIonChange={(e) => setName(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              value={email}
              readonly={!isEditing}
              onIonChange={(e) => setEmail(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Phone Number</IonLabel>
            <IonInput
              value={phoneNumber}
              readonly={!isEditing}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">First Name</IonLabel>
            <IonInput
              value={firstName}
              readonly={!isEditing}
              onIonChange={(e) => setFirstName(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Last Name</IonLabel>
            <IonInput
              value={lastName}
              readonly={!isEditing}
              onIonChange={(e) => setLastName(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Address</IonLabel>
            <IonInput
              value={address}
              readonly={!isEditing}
              onIonChange={(e) => setAddress(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonButton onClick={toggleEdit}>
              {isEditing ? 'Cancel' : 'Edit'}
            </IonButton>
          </IonItem>
          {isEditing && (
            <IonButton expand="full" onClick={handleSave}>
              Save
            </IonButton>
          )}
        </IonList>
        </IonCol>
        </IonRow>
        <IonRow>
            <IonCol size="8" size-md="5" offset-md="7">
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
        {/* Modal for image scaling */}
        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Scale Image</IonTitle>
              <IonButton slot="end" onClick={handleModalClose}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonImg
              src={scaledImage || ''}
              style={{ maxWidth: '100%', margin: '20px 0' }}
            />
            <IonRange
              min={1}
              max={3}
              step={0.1}
              snaps={true}
              value={scale}
              onIonChange={handleScaleChange}
            />
            <IonButton expand="full" onClick={handleModalSave}>
              Save
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Userprofile;
