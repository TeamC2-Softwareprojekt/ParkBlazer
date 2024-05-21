import React, { useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';

function MarkerMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCoordinates, setShowModalCoordinates] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [errorLatitude, setErrorLatitude] = useState('');
  const [errorLongitude, setErrorLongitude] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorAddress, setErrorAddress] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorImage, setErrorImage] = useState('');

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const openModal = () => {
    setShowModal(true);
    setShowMenu(false); 
  };

  const openModalCoordinates = () => {
    setShowModalCoordinates(true);
    setShowModal(false);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModalCoordinates = () => {
    setShowModalCoordinates(false);
  };

  const handleSaveCoordinates = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    let valid = true;

    // Validation of the Inputs
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setErrorLatitude('Bitte geben Sie eine gültige Breite zwischen -90 und 90 ein.');
      valid = false;
    } else {
      setErrorLatitude('');
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setErrorLongitude('Bitte geben Sie eine gültige Länge zwischen -180 und 180 ein.');
      valid = false;
    } else {
      setErrorLongitude('');
    }

    if (title.trim().length === 0) {
      setErrorTitle('Bitte geben Sie einen Titel ein.');
      valid = false;
    } 
    else {
      setErrorTitle('');
    }

    if (address.trim().length === 0) {
      setErrorAddress('Bitte geben Sie eine Adresse ein.');
      valid = false;
    } 
    else {
      setErrorAddress('');
    }

    if (description.trim().length === 0) {
      setErrorDescription('Bitte geben Sie eine Beschreibung ein.');
      valid = false;
    } 
    else {
      setErrorDescription('');
    }

    if (valid) {
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      closeModalCoordinates();
    }
  };
  const handleUseCurrentLocation = () => {
    // Logik aktueller Standort
    console.log('Aktuellen Standort verwenden');
    closeModal();
  };

  const handleSelectLocationOnMap = () => {
    // Logik für Postion auf der Karte
    console.log('Auf der Karte auswählen');
    closeModal();
  };


  return (
    <>
      <IonHeader>
        <IonToolbar>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Fab-Button */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={toggleMenu}>
            <IonIcon icon={showMenu ? chevronUpCircle : add}></IonIcon>
          </IonFabButton>
          {/* Fab-Liste */}
          <IonFabList side="top" className={showMenu ? 'show-menu' : ''}>
            {/* Option zum Öffnen des Modals */}
            <IonFabButton onClick={openModal}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>

        {/* Modal zum Erstellen eines Markers */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonContent>
            <IonList>
              <IonItem button onClick={handleUseCurrentLocation}>
                Aktuellen Standort verwenden
              </IonItem>
              <IonItem button onClick={handleSelectLocationOnMap}>
                Auf der Karte auswählen
              </IonItem>
              <IonItem button onClick={openModalCoordinates}>
                Koordinaten eingeben
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>

         {/* Modal zum Eingeben der Koordinaten */}
         <IonModal isOpen={showModalCoordinates} onDidDismiss={closeModalCoordinates}>
          <IonContent>
            <IonList>
              <IonItem>
                <IonInput
                  type="number"
                  placeholder="Latitude"
                  value={latitude}
                  onIonChange={e => setLatitude(e.detail.value!)} 
                />
              </IonItem>
              {errorLatitude && (
                <IonItem>
                  <IonText color="danger">{errorLatitude}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="number"
                  placeholder="Longitude"
                  value={longitude}
                  onIonChange={e => setLongitude(e.detail.value!)}
                />
              </IonItem>
              {errorLongitude && (
                <IonItem>
                  <IonText color="danger">{errorLongitude}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="title"
                  value={title}
                  onIonChange={e => setTitle(e.detail.value!)} 
                />
              </IonItem>
              {errorTitle && (
                <IonItem>
                <IonText color="danger">{errorTitle}</IonText>
              </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="address"
                  value={address}
                  onIonChange={e => setAddress(e.detail.value!)} 
                />
              </IonItem>
              {errorAddress && (
                <IonItem>
                <IonText color="danger">{errorAddress}</IonText>
              </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="description"
                  value={description}
                  onIonChange={e => setDescription(e.detail.value!)} 
                />
              </IonItem>
              {errorDescription && (
                <IonItem>
                <IonText color="danger">{errorDescription}</IonText>
              </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="url"
                  placeholder="image"
                  value={image}
                  onIonChange={e => setImage(e.detail.value!)} 
                />
              </IonItem>
              {errorImage && (
                <IonItem>
                <IonText color="danger">{errorImage}</IonText>
              </IonItem>
              )}
              <IonButton onClick={handleSaveCoordinates}>Speichern</IonButton>
            </IonList>
          </IonContent>
        </IonModal>

        {/* Modal zum Erstellen eines Parkplatzes mit Auswahl auf der Karte  */}


      </IonContent>
    </>
  );
}

export default MarkerMenu;
