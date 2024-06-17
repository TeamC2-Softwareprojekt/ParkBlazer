import React, { useEffect, useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem, IonText, IonToast, IonCheckbox, IonLabel, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';
import { globalSelectingLocation, setGlobalSelectingLocation, globalLatitude, globalLongitude } from './map';
import AuthService from '../AuthService';


export const MarkerMenu: React.FC = () => {
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

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('success');
  const [firstopenSelectionMap, setFirstopenSelectionMap] = useState(false);
  const [alert, setAlert] = useState(false);

  const token = AuthService.getToken();

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
  
      if (data.items && data.items.length > 0) {
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
      } else {
        setNotificationMessage('Keine Adresse gefunden.');
        setNotificationColor('danger');
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Adresse:', error);
      setNotificationMessage('Fehler beim Abrufen der Adresse.');
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
        // Send spot to server
        const response = await fetch('https://server-y2mz.onrender.com/api/create_parkingspot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
          setAlert(true);
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
        fetchAddress(position.coords.latitude.toString(), position.coords.longitude.toString());
        openModalCoordinates(); 
      },
      (error) => {
        console.error('Fehler beim Abrufen der Position', error);
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
    console.log('Die SelectionLocation vorher: '+globalSelectingLocation);
    closeModal();
    setNotificationMessage('Bitte wählen Sie einen Punkt auf der Karte aus.');
    setNotificationColor('success');
    setShowNotification(true);
    setGlobalSelectingLocation(true);
    console.log('Die SelectionLocation: '+globalSelectingLocation);
  };

  useEffect(() => { 
    if (!globalSelectingLocation) {
      if(firstopenSelectionMap == true){
        handleSelectLocationOnMapAfterClicking();
      }
      setFirstopenSelectionMap(true);
    }
  }, [globalSelectingLocation]);
  
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
        console.error('Fehler beim Abrufen der Länder:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleSelectLocationOnMapAfterClicking = () => { 
    if(globalLatitude && globalLongitude) { 
      setLatitude(globalLatitude.toString()); 
      setLongitude(globalLongitude.toString()); 
      fetchAddress(globalLatitude.toString(), globalLongitude.toString());
    }
    openModalCoordinates();
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
              PKW<IonCheckbox  checked={typeCar} onIonChange={e => setTypeCar(e.detail.checked)} />
              Fahrrad<IonCheckbox checked={typeBike} onIonChange={e => setTypeBike(e.detail.checked)} />
              LKW<IonCheckbox checked={typeTruk} onIonChange={e => setTypeTruk(e.detail.checked)} />
            </IonItem>
            <IonItem>
              <IonLabel style={{ marginRight: '10px' }}>Bild-URL: </IonLabel>
              <IonInput value={image} onIonChange={e => setImage(e.detail.value || '')} />
              {errorImage && <IonText color="danger">{errorImage}</IonText>}
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
      <IonAlert
        isOpen={alert}
        onDidDismiss={() => {
          setAlert(false);
          window.location.reload(); // Seite neu laden
        }}
        header={"Successful"}
        message={"Parkplatz erfolgreich erstellt."}
        buttons={["OK"]}
      />
    </>
  );
};

export default MarkerMenu;


