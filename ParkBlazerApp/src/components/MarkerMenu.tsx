import React, { useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonTitle, IonToolbar, IonModal, IonInput, IonButton, IonList, IonItem } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';

function MarkerMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const openModal = () => {
    setShowModal(true);
    setShowMenu(false); 
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveCoordinates = () => {
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    closeModal();
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

        {/* Modal zum Eingeben der Koordinaten */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonContent>
            <IonList>
              <IonItem button onClick={handleUseCurrentLocation}>
                Aktuellen Standort verwenden
              </IonItem>
              <IonItem button onClick={handleSelectLocationOnMap}>
                Auf der Karte auswählen
              </IonItem>
              <IonItem button onClick={handleSaveCoordinates}>
                Koordinaten eingeben
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </>
  );
}

export default MarkerMenu;
