import React, { useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText, IonToast } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';

function MarkerMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCoordinates, setShowModalCoordinates] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [available_spaces, setAvailbleSpaces] = useState('');
  const [image, setImage] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [errorLatitude, setErrorLatitude] = useState('');
  const [errorLongitude, setErrorLongitude] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorAvailableSpaces, setErrorAvailableSpaces] = useState('');
  const [errorImage, setErrorImage] = useState('');
  const [errorStreet, setErrorStreet] = useState('');
  const [errorHouseNumber, setErrorHouseNumber] = useState('');
  const [errorZip, setErrorZip] = useState('');
  const [errorCity, setErrorCity] = useState('');
  const [errorCountry, setErrorCountry] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('success');

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
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModalCoordinates = () => {
    setShowModalCoordinates(false);
  };

  const handleSaveCoordinates = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    let valid = true;

    // Validation of input
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
    } else {
      setErrorTitle('');
    }

    if (street.trim().length === 0) {
      setErrorStreet('Bitte geben Sie eine Adresse ein.');
      valid = false;
    } else {
      setErrorStreet('');
    }

    if (description.trim().length === 0) {
      setErrorDescription('Bitte geben Sie eine Beschreibung ein.');
      valid = false;
    } else {
      setErrorDescription('');
    }

    if (available_spaces.trim().length === 0) {
      setErrorAvailableSpaces('Bitte geben Sie die Anzahl der Parkplätze an.');
      valid = false;
    } else {
      setErrorAvailableSpaces('');
    }

    if (houseNumber.trim().length === 0) {
      setErrorHouseNumber('Bitte geben Sie eine Hausnummer ein.');
      valid = false;
    } else {
      setErrorHouseNumber('');
    }

    if (zip.trim().length === 0) {
      setErrorZip('Bitte geben Sie eine Postleitzahl ein.');
      valid = false;
    } else {
      setErrorZip('');
    }

    if (city.trim().length === 0) {
      setErrorCity('Bitte geben Sie eine Stadt ein.');
      valid = false;
    } else {
      setErrorCity('');
    }

    if (country.trim().length === 0) {
      setErrorCountry('Bitte geben Sie ein Land ein.');
      valid = false;
    } else {
      setErrorCountry('');
    }

    if (valid) {
      try {
        // Check if spot already exists
        const existingSpotsResponse = await fetch('https://server-y2mz.onrender.com/api/get_parkingspots');
        const existingSpots = await existingSpotsResponse.json();

        const spotExists = existingSpots.some((spot: { latitude: number; longitude: number; name: string; }) => 
          (spot.latitude === lat && spot.longitude === lng) || spot.name === title
        );

        if (spotExists) {
          setNotificationMessage('Parkplatz existiert bereits.');
          setNotificationColor('danger');
          setShowNotification(true);
          return;
        }
        // Send spot to server
        const response = await fetch('https://server-y2mz.onrender.com/api/create_parkingspot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: title,
            description: description,
            type: 'public',
            available_spaces: available_spaces,
            image_url: image,
            latitude: latitude,
            longitude: longitude,
            street: street,
            house_number: houseNumber,
            zip: zip,
            city: city,
            country: country,
            user_id: 'TestUser' 
          })
        });
        // Check if response is ok
        if (response.ok) {
          const data = await response.json();
          setNotificationMessage('Parkplatz erfolgreich gespeichert.');
          setNotificationColor('success');
          setShowNotification(true);
          console.log('Erfolgreich gespeichert:', data);
        } else {
          throw new Error('Fehler beim Speichern');
        }
      } catch (error) {
        setNotificationMessage('Fehler beim Speichern.');
        setNotificationColor('danger');
        setShowNotification(true);
        console.error('Fehler beim Speichern:', error);
      }

      closeModalCoordinates();
    }
  };

  const handleUseCurrentLocation = () => {
    // #TODO: Logic to use current location
    console.log('Aktuellen Standort verwenden');
    closeModal();
  };

  const handleSelectLocationOnMap = () => {
    // #TODO: Logic to select location on map
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
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={toggleMenu}>
            <IonIcon icon={showMenu ? chevronUpCircle : add}></IonIcon>
          </IonFabButton>
          <IonFabList side="top" className={showMenu ? 'show-menu' : ''}>
            <IonFabButton onClick={openModal}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>

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

        <IonModal isOpen={showModalCoordinates} onDidDismiss={closeModalCoordinates}>
          <IonContent>
            <IonList>
              <IonItem>
                <IonInput
                  type="number"
                  placeholder="Latitude"
                  value={latitude}
                  onIonChange={e => setLatitude(e.detail.value ? e.detail.value.replace(',', '.') : '')} 
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
                  onIonChange={e => setLongitude(e.detail.value ? e.detail.value.replace(',', '.') : '')} 
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
                  placeholder="Titel"
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
                  placeholder="Anzahl der Parkplätze"
                  value={available_spaces}
                  onIonChange={e => setAvailbleSpaces(e.detail.value!)} 
                />
              </IonItem>
              {errorAvailableSpaces && (
                <IonItem>
                  <IonText color="danger">{errorAvailableSpaces}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Adresse"
                  value={street}
                  onIonChange={e => setStreet(e.detail.value!)} 
                />
              </IonItem>
              {errorStreet && (
                <IonItem>
                  <IonText color="danger">{errorStreet}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Hausnummer"
                  value={houseNumber}
                  onIonChange={e => setHouseNumber(e.detail.value!)} 
                />
              </IonItem>
              {errorHouseNumber && (
                <IonItem>
                  <IonText color="danger">{errorHouseNumber}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Postleitzahl"
                  value={zip}
                  onIonChange={e => setZip(e.detail.value!)} 
                />
              </IonItem>
              {errorZip && (
                <IonItem>
                  <IonText color="danger">{errorZip}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Stadt"
                  value={city}
                  onIonChange={e => setCity(e.detail.value!)} 
                />
              </IonItem>
              {errorCity && (
                <IonItem>
                  <IonText color="danger">{errorCity}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Land"
                  value={country}
                  onIonChange={e => setCountry(e.detail.value!)} 
                />
              </IonItem>
              {errorCountry && (
                <IonItem>
                  <IonText color="danger">{errorCountry}</IonText>
                </IonItem>
              )}
              <IonItem>
                <IonInput
                  type="text"
                  placeholder="Beschreibung"
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
                  placeholder="Bild URL"
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
        
        <IonToast
          isOpen={showNotification}
          message={notificationMessage}
          color={notificationColor}
          duration={2000}
          onDidDismiss={() => setShowNotification(false)}
        />
      </IonContent>
    </>
  );
}

export default MarkerMenu;
