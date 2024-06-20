import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText, IonToast, IonCheckbox, IonLabel, IonSelect, IonSelectOption, IonAlert, IonPopover, IonDatetime } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';
import './MarkerMenu.css';
import { map } from './map';
import AuthService from '../utils/AuthService';
import { parkingspaces } from '../data/parkingSpaces';
import { getUserLocation } from '../data/userLocation';
import ImageUploader from '../components/ImageUploader';


export const MarkerMenu: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCoordinates, setShowModalCoordinates] = useState(false);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [availableSpaces, setAvailableSpaces] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
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
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
  const [alert, setAlert] = useState(false);

  const token = AuthService.getToken();

  function handleMapClick(e: any) {
    const coords = e.lngLat;
    setLatitude(coords.lat.toString());
    setLongitude(coords.lng.toString());
    fetchAddress(coords.lat.toString(), coords.lng.toString());
    openModalCoordinates();
    map.current?.off('click', handleMapClick);
  }

  const documentInputRef = useRef<HTMLInputElement>(null);

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

  const fetchAddress = async (lat: string, lng: string) => {
    const apiKey = '0vf8x75eZh1xvgkTcJfy_yIomOKw5ww0YIuJanRkzmU';
    try {
      const response = await fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=en-US&apikey=${apiKey}`);
      const data = await response.json();

      if (!(data.items && data.items.length > 0)) {
        setNotificationMessage('No address found.');
        setNotificationColor('danger');
        setShowNotification(true);
        return;
      }
      const address = data.items[0].address;
      setStreet(address.street || '');
      setHouseNumber(address.houseNumber || '');
      setZip(address.postalCode || '');
      setCity(address.city || '');
      setCountry(address.countryName || '');

      // Set country select to the found country
      const countryOption = countries.find(country => country.label === address.countryName);
      if (countryOption) {
        setSelectedCountry(countryOption.value);
        setCountry(countryOption.value);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setNotificationMessage('Error fetching address.');
      setNotificationColor('danger');
      setShowNotification(true);
    }
  };

  const handleSaveCoordinates = async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    let valid = true;
    const validations = [
      { isValid: validateField(title), message: 'Bitte geben Sie einen Titel ein.', setError: setErrorTitle },
      { isValid: validateField(street), message: 'Bitte geben Sie eine Adresse ein.', setError: setErrorStreet },
      { isValid: validateField(description), message: 'Bitte geben Sie eine Beschreibung ein.', setError: setErrorDescription },
      { isValid: validateField(availableSpaces), message: 'Bitte geben Sie die Anzahl der Parkplätze an.', setError: setErrorAvailableSpaces },
      { isValid: validateField(houseNumber), message: 'Bitte geben Sie eine Hausnummer ein.', setError: setErrorHouseNumber },
      { isValid: validateField(zip), message: 'Bitte geben Sie eine Postleitzahl ein.', setError: setErrorZip },
      { isValid: validateField(city), message: 'Bitte geben Sie eine Stadt ein.', setError: setErrorCity },
      { isValid: validateField(country), message: 'Bitte geben Sie ein Land ein.', setError: setErrorCountry },
      { isValid: !privateSpot || pricePerHour, message: 'Bitte geben Sie einen Preis pro Stunde ein.', setError: setErrorPricePerHour },
      { isValid: !privateSpot || selectedDocument, message: 'Bitte laden Sie ein Dokument hoch.', setError: setErrorDocument },
      { isValid: !privateSpot || selectedStartDate! < selectedEndDate! && valid, message: 'Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.', setError: setErrorDate }
    ];
    validations.forEach(({ isValid, message, setError }) => {
      if (!isValid) {
        setError(message);
        valid = false;
      } else {
        setError('');
      }
    });

    if (!valid) return;

    const spotExists = parkingspaces.some((spot: { latitude: number; longitude: number; name: string; }) =>
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
      image_url: imageUrl,
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

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthService.getToken()}`
        },
        body: data
      });

      if (response.ok) {
        setNotificationMessage('Parkingspace saved successfully.');
        setNotificationColor('success');
        setShowNotification(true);
        resetAttributes();
      } else {
        const errorData = await response.json();
        setNotificationMessage(errorData.message || 'Error while saving.');
        setNotificationColor('danger');
        setShowNotification(true);
        console.error('Error while saving:', errorData);
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      setNotificationMessage('Fehler beim Speichern.');
      setNotificationColor('danger');
      setShowNotification(true);
      console.error('Fehler beim Speichern:', error);
    }
    closeModalCoordinates();
  };

  const handleUseCurrentLocation = () => {
    const userLocation = getUserLocation();

    if (!userLocation.latitude || !userLocation.longitude) {
      setNotificationMessage('Dein Standort ist zu ungenau: Probiere es erneut!');
      setNotificationColor('danger');
      setShowNotification(true);
      return;
    }

    setLatitude(userLocation.latitude.toString());
    setLongitude(userLocation.longitude.toString());
    fetchAddress(userLocation.latitude.toString(), userLocation.longitude.toString());
    openModalCoordinates();
  };

  const handleSelectLocationOnMap = () => {
    closeModal();
    setNotificationMessage('Bitte wählen Sie einen Punkt auf der Karte aus.');
    setNotificationColor('success');
    setShowNotification(true);
    map.current?.on('click', handleMapClick);
  };

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setErrorImage('');
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht okay');
        }
        const data = await response.json();
        const countryOptions = data.map((country: any) => ({
          value: country.cca2,
          label: country.name.common
        }));

        const preferredCountries = ['DE', 'US', 'FR'].map(code =>
          countryOptions.find((country: { value: string; }) => country.value === code)
        ).filter(Boolean);

        const otherCountries = countryOptions.filter((country: any) => !preferredCountries.includes(country))
          .sort((a: { label: string; }, b: { label: any; }) => a.label.localeCompare(b.label));

        const sortedCountryOptions = [
          ...preferredCountries,
          ...otherCountries
        ];

        setCountries(sortedCountryOptions);
      } catch (error) {
        console.error('Error catching countries', error);
      }
    };

    fetchCountries();
  }, []);

  const resetAttributes = () => {
    setLatitude('');
    setLongitude('');
    setTitle('');
    setDescription('');
    setAvailableSpaces('');
    setImageUrl('');
    setStreet('');
    setHouseNumber('');
    setZip('');
    setCity('');
    setCountry('');
    setPricePerHour(undefined);
    setSelectedDocument(null);
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
              <IonSelect
                value={selectedCountry}
                placeholder="Wählen Sie ein Land"
                onIonChange={e => {
                  setSelectedCountry(e.detail.value);
                  setCountry(e.detail.value);
                }}
              >
                {countries.map(country => (
                  <IonSelectOption key={country.value} value={country.value}>
                    {country.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {errorCountry && <IonText color="danger">{errorCountry}</IonText>}
            </IonItem>
            <IonItem>
              PKW<IonCheckbox class="marker-menu-checkbox" checked={typeCar} onIonChange={e => setTypeCar(e.detail.checked)} />
              Fahrrad<IonCheckbox class="marker-menu-checkbox" checked={typeBike} onIonChange={e => setTypeBike(e.detail.checked)} />
              LKW<IonCheckbox class="marker-menu-checkbox" checked={typeTruk} onIonChange={e => setTypeTruk(e.detail.checked)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Bild</IonLabel>
              <ImageUploader onUploadComplete={handleUploadComplete} />
              {errorImage && <IonText color="danger">{errorImage}</IonText>}
            </IonItem>
            <IonItem>
              Privat<IonCheckbox class="marker-menu-checkbox" checked={privateSpot} onIonChange={e => setPrivateSpot(e.detail.checked)} />
            </IonItem>
            <div style={{ display: privateSpot ? "" : "none" }}>
              <IonItem>
                <IonInput onInput={e => { setPricePerHour(Number((e.target as HTMLInputElement).value)); setErrorPricePerHour('') }} value={pricePerHour} class="price-input" label="Preis pro Stunde" type="number" placeholder="0€" labelPlacement="stacked" inputMode="numeric" min={0} />
                {errorPricePerHour && <IonText id='error-price-per-hour-input' color="danger">{errorPricePerHour}</IonText>}
              </IonItem>
              <IonItem>
                <input type="file" ref={documentInputRef} style={{ display: "none" }} onChange={e => setSelectedDocument(e.target.value)} />
                <IonButton onClick={() => { documentInputRef.current?.click(); setErrorDocument('') }}>Dokument hochladen</IonButton>
                {errorDocument && <IonText color="danger">{errorDocument}</IonText>}
                <label>{selectedDocument?.split('\\')[2]}</label>
                <IonButton id="document-information">
                  <IonIcon src="src\icons\information-circle-outline.svg" id='document-information-icon' />
                  <IonPopover trigger="document-information" id="document-explanation">Ein Dokument, das beweist, dass Sie diesen Parkplatz besitzen und vermieten können.</IonPopover>
                </IonButton>
              </IonItem>
              <IonItem>
                <div id="availability-container">
                  <div>
                    <IonLabel>Verfügbarkeitszeitraum</IonLabel>
                    {errorDate && <IonText color="danger">{errorDate}</IonText>}
                  </div>
                  <div id="date-container">
                    <IonDatetime onIonChange={e => { setSelectedStartDate(new Date(String(e.detail.value))); setErrorDate(''); }} />
                    <IonDatetime onIonChange={e => { setSelectedEndDate(new Date(String(e.detail.value))); setErrorDate(''); }} />
                  </div>
                </div>
              </IonItem>
            </div>
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
      <IonAlert
        isOpen={alert}
        onDidDismiss={() => {
          setAlert(false);
          window.location.reload();
        }}
        header={"Successful"}
        message={"Parkplatz erfolgreich erstellt."}
        buttons={["OK"]}
      />
    </div>
  );
};

export default MarkerMenu;


