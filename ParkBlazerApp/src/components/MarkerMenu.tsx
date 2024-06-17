import React, { useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText, IonToast, IonCheckbox, IonLabel, IonPopover, IonDatetime } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';
import './MarkerMenu.css';
import AuthService from '../AuthService';

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
  const [privateSpot, setPrivateSpot] = useState<boolean>(false);
  const [pricePerHour, setPricePerHour] = useState<number>();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());

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
  const [errorPricePerHour, setErrorPricePerHour] = useState<string>('');
  const [errorDocument, setErrorDocument] = useState<string>('');
  const [errorDate, setErrorDate] = useState<string>('');

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('success');

    function openDocumentDiaglog() {
        document.getElementById('document-input')?.click();
    }

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

  const validateField = (value: string): boolean => { return value.trim().length > 0; };
  const handleSaveCoordinates = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    let valid = true;
    const validations = [
      { isValid: !isNaN(lat) && lat >= -90 && lat <= 90, message: 'Bitte geben Sie einen gültigen Breitengrad zwischen -90 und 90 ein.', setError: setErrorLatitude },
      { isValid: !isNaN(lng) && lng >= -180 && lng <= 180, message: 'Bitte geben Sie einen gültigen Längengrad zwischen -180 und 180 ein.', setError: setErrorLongitude },
      { isValid: validateField(title), message: 'Bitte geben Sie einen Titel ein.', setError: setErrorTitle },
      { isValid: validateField(street), message: 'Bitte geben Sie eine Adresse ein.', setError: setErrorStreet },
      { isValid: validateField(description), message: 'Bitte geben Sie eine Beschreibung ein.', setError: setErrorDescription },
      { isValid: validateField(availableSpaces), message: 'Bitte geben Sie die Anzahl der Parkplätze an.', setError: setErrorAvailableSpaces },
      { isValid: validateField(houseNumber), message: 'Bitte geben Sie eine Hausnummer ein.', setError: setErrorHouseNumber },
      { isValid: validateField(zip), message: 'Bitte geben Sie eine Postleitzahl ein.', setError: setErrorZip },
      { isValid: validateField(city), message: 'Bitte geben Sie eine Stadt ein.', setError: setErrorCity },
      { isValid: validateField(country), message: 'Bitte geben Sie ein Land ein.', setError: setErrorCountry },
      { isValid: !privateSpot || pricePerHour !== undefined, message: 'Bitte geben Sie einen Preis pro Stunde ein.', setError: setErrorPricePerHour },
      { isValid: !privateSpot || selectedDocument !== null, message: 'Bitte laden Sie ein Dokument hoch.', setError: setErrorDocument },
      { isValid: !privateSpot || selectedStartDate! < selectedEndDate! && valid, message: 'Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.', setError: setErrorDate}
    ];
    validations.forEach(({ isValid, message, setError }) => {
      if (!isValid) {
        setError(message);
        valid = false;
      } else {
        setError('');
      }
    });

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

        let data = JSON.stringify({
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
            price_per_hour: privateSpot ? pricePerHour : undefined,
            availability_start_date: privateSpot ? selectedStartDate?.toISOString() : undefined,
            availability_end_date: privateSpot ? selectedEndDate?.toISOString() : undefined,
            document: privateSpot ? selectedDocument : undefined
        });

        let url = 'https://server-y2mz.onrender.com/api/create_parkingspot';
        if (privateSpot) url = 'https://server-y2mz.onrender.com/api/create_privateparkingspot';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${AuthService.getToken()}`
            },
            body: data
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
    if (!navigator.geolocation) return;
    
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
  };

  const handleSelectLocationOnMap = () => {
    // #TODO: Logic to select location on map
    console.log('Auf der Karte auswählen');
    closeModal();
  };

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
    setPricePerHour(undefined);
    setSelectedDocument(null);
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
    setErrorPricePerHour('');
    setErrorDocument('');
  };

  return (
    <div id='marker-menu'>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={toggleMenu}>
          <IonIcon icon={chevronUpCircle} />
        </IonFabButton>
        <IonFabList side="top" activated={showMenu}>
          <IonFabButton id='create-marker-modal-button' onClick={openModal}>
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
          <IonButton id='create-marker-with-coordinates' expand="block" onClick={openModalCoordinates}>
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
            <IonLabel style={{ marginRight: '10px' }}>Breitengrad: </IonLabel>
              <IonInput id='latitude-input' type="number" value={latitude} onIonChange={e => setLatitude(e.detail.value || '')} />
              {errorLatitude && <IonText id='error-latitude-input' color="danger">{errorLatitude}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Längengrad: </IonLabel>
              <IonInput id='longitude-input' type="number" value={longitude} onIonChange={e => setLongitude(e.detail.value || '')} />
              {errorLongitude && <IonText id='error-longitude-input' color="danger">{errorLongitude}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Titel: </IonLabel>
              <IonInput id='title-input' value={title} onIonChange={e => setTitle(e.detail.value || '')} />
              {errorTitle && <IonText id='error-title-input' color="danger">{errorTitle}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Beschreibung: </IonLabel>
              <IonInput id='description-input' value={description} onIonChange={e => setDescription(e.detail.value || '')} />
              {errorDescription && <IonText id='error-description-input' color="danger">{errorDescription}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Anzahl Parkplätze: </IonLabel>
              <IonInput id='available-spaces-input' value={availableSpaces} onIonChange={e => setAvailableSpaces(e.detail.value || '')} />
              {errorAvailableSpaces && <IonText id='error-available-spaces-input' color="danger">{errorAvailableSpaces}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Straße: </IonLabel>
              <IonInput id='street-input' value={street} onIonChange={e => setStreet(e.detail.value || '')} />
              {errorStreet && <IonText id='error-street-input' color="danger">{errorStreet}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Hausnummer: </IonLabel>
              <IonInput id='house-number-input' value={houseNumber} onIonChange={e => setHouseNumber(e.detail.value || '')} />
              {errorHouseNumber && <IonText id='error-house-number-input' color="danger">{errorHouseNumber}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>PLZ: </IonLabel>
              <IonInput id='zip-input' value={zip} onIonChange={e => setZip(e.detail.value || '')} />
              {errorZip && <IonText id='error-zip-input' color="danger">{errorZip}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Stadt: </IonLabel>
              <IonInput id='city-input' value={city} onIonChange={e => setCity(e.detail.value || '')} />
              {errorCity && <IonText id='error-city-input' color="danger">{errorCity}</IonText>}
            </IonItem>
            <IonItem>
            <IonLabel style={{ marginRight: '10px' }}>Land: </IonLabel>
              <IonInput id='country-input' value={country} onIonChange={e => setCountry(e.detail.value || '')} />
              {errorCountry && <IonText id='error-country-input' color="danger">{errorCountry}</IonText>}
            </IonItem>
            <IonItem>
              PKW<IonCheckbox class="marker-menu-checkbox" checked={typeCar} onIonChange={e => setTypeCar(e.detail.checked)} />
              Fahrrad<IonCheckbox class="marker-menu-checkbox" checked={typeBike} onIonChange={e => setTypeBike(e.detail.checked)} />
              LKW<IonCheckbox class="marker-menu-checkbox" checked={typeTruk} onIonChange={e => setTypeTruk(e.detail.checked)} />
            </IonItem>
            <IonItem>
                Privat<IonCheckbox class="marker-menu-checkbox" checked={privateSpot} onIonChange={e => setPrivateSpot(e.detail.checked)}/>
            </IonItem>
            <IonItem style={{display: privateSpot ? "" : "none"}}>
                    <IonInput onInput={e => {setPricePerHour(Number((e.target as HTMLInputElement).value)); setErrorPricePerHour('')}} value={pricePerHour} class="price-input" label="Preis pro Stunde" type="number" placeholder="0€" labelPlacement="stacked" inputMode="numeric" min={0}/>
                    {errorPricePerHour && <IonText id='error-price-per-hour-input' color="danger">{errorPricePerHour}</IonText>}
            </IonItem>
            <IonItem style={{display: privateSpot ? "" : "none"}}>
                    <input type="file" id="document-input" style={{display: "none"}} onChange={e => setSelectedDocument(e.target.value)} />
                    <IonButton onClick={() => {openDocumentDiaglog(); setErrorDocument('')}}>Dokument hochladen</IonButton>
                    {errorDocument && <IonText id='error-document-input' color="danger">{errorDocument}</IonText>}
                    <label>{selectedDocument?.split('\\')[2]}</label>
                    <IonButton id="document-information"> 
                        <IonIcon src="src\icons\information-circle-outline.svg" id='document-information-icon' ></IonIcon>
                        <IonPopover trigger="document-information" id="document-explanation">Ein Dokument, das beweist, dass Sie diesen Parkplatz besitzen und vermieten können.</IonPopover>
                    </IonButton>
            </IonItem>
            <IonItem style={{display: privateSpot ? "" : "none"}}>
                <div id="availability-container">
                    <div>
                        <IonLabel>Verfügbarkeitszeitraum</IonLabel>
                        {errorDate && <IonText id='error-document-input' color="danger">{errorDate}</IonText>}
                    </div>
                    <div id="date-container">
                    <IonDatetime onIonChange={e => {setSelectedStartDate(new Date(String(e.detail.value))); setErrorDate('');}} id="start-date"/>
                    <IonDatetime onIonChange={e => {setSelectedEndDate(new Date(String(e.detail.value))); setErrorDate('');}} id="end-date"/>
                    </div>
                </div>
            </IonItem>
          </IonList>
          <IonButton expand="block" id='marker-submit' onClick={handleSaveCoordinates}>
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
    </div>
  );
}

export default MarkerMenu;
