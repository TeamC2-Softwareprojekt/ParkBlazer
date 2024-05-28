import React, { useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText, IonToast, IonCheckbox, IonLabel } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';

function MarkerMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCoordinates, setShowModalCoordinates] = useState(false);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [availableSpaces, setAvailableSpaces] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [typeCar, setTypeCar] = useState<boolean>(false);
  const [typeBike, setTypeBike] = useState<boolean>(false);
  const [typeTruk, setTypeTruk] = useState<boolean>(false);

  const [errorLatitude, setErrorLatitude] = useState<string>('');
  const [errorLongitude, setErrorLongitude] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');
  const [errorAvailableSpaces, setErrorAvailableSpaces] = useState<string>('');
  const [errorImage, setErrorImage] = useState<string>('');
  const [errorStreet, setErrorStreet] = useState<string>('');
  const [errorHouseNumber, setErrorHouseNumber] = useState<string>('');
  const [errorZip, setErrorZip] = useState<string>('');
  const [errorCity, setErrorCity] = useState<string>('');
  const [errorCountry, setErrorCountry] = useState<string>('');

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

    if (availableSpaces.trim().length === 0) {
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
            available_spaces: availableSpaces,
            image_url: image,
            latitude: latitude,
            longitude: longitude,
            street: street,
            house_number: houseNumber,
            zip: zip,
            city: city,
            country: country,
            type_car: typeCar ? '1' : '0',
            type_bike: typeBike ? '1' : '0',
            type_truk: typeTruk ? '1' : '0',
          })
        });

        if (response.ok) {
          const data = await response.json();
          setNotificationMessage('Parkplatz erfolgreich gespeichert.');
          setNotificationColor('success');
          setShowNotification(true);
          console.log('Erfolgreich gespeichert:', data);
          resetAttributes();
        } else {
          const errorData = await response.json();
          setNotificationMessage(errorData.message || 'Fehler beim Speichern.');
          setNotificationColor('danger');
          setShowNotification(true);
          console.error('Fehler beim Speichern:', errorData);
        }
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
        setNotificationMessage('Fehler beim Speichern.');
        setNotificationColor('danger');
        setShowNotification(true);
        console.error('Fehler beim Speichern:', error);
      }

      closeModalCoordinates();
    }
  };

  // this function is for handling the current location to create a new parking spot
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords.accuracy > 200) {
            setNotificationMessage('Dein Standort ist zu ungenau: Probiere es erneut!');
            setNotificationColor('danger');
            setShowNotification(true);
            return;
          }
          setLatitude(position.coords.latitude.toString()); 
          setLongitude(position.coords.longitude.toString()); 
          openModalCoordinates(); 
        },
        (error) => {
          console.error('Error getting location', error);
          setNotificationMessage('Fehler beim Abrufen der aktuellen Position.');
          setNotificationColor('danger');
          setShowNotification(true);
        },
        {
          enableHighAccuracy: true
        }
      );
    } 
  };

  const handleSelectLocationOnMap = () => {
    // #TODO: Logic to select location on map
    console.log('Auf der Karte auswählen');
    closeModal();
  };

  // reset all attributes
  const resetAttributes = () => {
    setLatitude('');
    setLongitude('');
    setTitle('');
    setDescription('');
    setAvailableSpaces('');
    setImage('');
    setStreet('');
    setHouseNumber('');
    setZip('');
    setCity('');
    setCountry('');
    setErrorLatitude('');
    setErrorLongitude('');
    setErrorTitle('');
    setErrorDescription('');
    setErrorAvailableSpaces('');
    setErrorImage('');
    setErrorStreet('');
    setErrorHouseNumber('');
    setErrorZip('');
    setErrorCity('');
    setErrorCountry('');
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={toggleMenu}>
          <IonIcon icon={chevronUpCircle} />
        </IonFabButton>
        <IonFabList side="top" activated={showMenu}>
          <IonFabButton onClick={openModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
      <IonModal isOpen={showModal} onDidDismiss={closeModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Neuen Parkplatz erstellen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton expand="block" onClick={handleUseCurrentLocation}>
            Aktuellen Standort verwenden
          </IonButton>
          <IonButton expand="block" onClick={handleSelectLocationOnMap}>
            Auf der Karte auswählen
          </IonButton>
          <IonButton expand="block" onClick={openModalCoordinates}>
            Koordinaten eingeben
          </IonButton>
          <IonButton expand="block" color="danger" onClick={closeModal}>
            Abbrechen
          </IonButton>
        </IonContent>
      </IonModal>
      <IonModal isOpen={showModalCoordinates} onDidDismiss={closeModalCoordinates}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Parkplatz Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Breite: </IonLabel>
              <IonInput type="number" value={latitude} onIonChange={e => setLatitude(e.detail.value || '')} />
              {errorLatitude && <IonText color="danger">{errorLatitude}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Länge: </IonLabel>
              <IonInput type="number" value={longitude} onIonChange={e => setLongitude(e.detail.value || '')} />
              {errorLongitude && <IonText color="danger">{errorLongitude}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Titel: </IonLabel>
              <IonInput value={title} onIonChange={e => setTitle(e.detail.value || '')} />
              {errorTitle && <IonText color="danger">{errorTitle}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Beschreibung: </IonLabel>
              <IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')} />
              {errorDescription && <IonText color="danger">{errorDescription}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Anzahl Parkplätze: </IonLabel>
              <IonInput value={availableSpaces} onIonChange={e => setAvailableSpaces(e.detail.value || '')} />
              {errorAvailableSpaces && <IonText color="danger">{errorAvailableSpaces}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Straße: </IonLabel>
              <IonInput value={street} onIonChange={e => setStreet(e.detail.value || '')} />
              {errorStreet && <IonText color="danger">{errorStreet}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Hausnummer: </IonLabel>
              <IonInput value={houseNumber} onIonChange={e => setHouseNumber(e.detail.value || '')} />
              {errorHouseNumber && <IonText color="danger">{errorHouseNumber}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>PLZ: </IonLabel>
              <IonInput value={zip} onIonChange={e => setZip(e.detail.value || '')} />
              {errorZip && <IonText color="danger">{errorZip}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Stadt: </IonLabel>
              <IonInput value={city} onIonChange={e => setCity(e.detail.value || '')} />
              {errorCity && <IonText color="danger">{errorCity}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Land: </IonLabel>
              <IonInput value={country} onIonChange={e => setCountry(e.detail.value || '')} />
              {errorCountry && <IonText color="danger">{errorCountry}</IonText>}
            </IonItem>
            <IonItem>
              PKW<IonCheckbox  checked={typeCar} onIonChange={e => setTypeCar(e.detail.checked)} />
              Fahrrad<IonCheckbox checked={typeBike} onIonChange={e => setTypeBike(e.detail.checked)} />
              LKW<IonCheckbox checked={typeTruk} onIonChange={e => setTypeTruk(e.detail.checked)} />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleSaveCoordinates}>
            Speichern
          </IonButton>
          <IonButton expand="block" color="danger" onClick={closeModalCoordinates}>
            Abbrechen
          </IonButton>
        </IonContent>
      </IonModal>
      <IonToast
        isOpen={showNotification}
        onDidDismiss={() => setShowNotification(false)}
        message={notificationMessage}
        color={notificationColor}
        duration={2000}
      />
    </>
  );
}

export default MarkerMenu;
