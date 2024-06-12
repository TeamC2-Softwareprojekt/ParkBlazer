import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import { chevronUpCircle, add } from 'ionicons/icons';

interface FloatingMenuProps {
  toggleMenu: () => void;
  showMenu: boolean;
  openModal: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ toggleMenu, showMenu, openModal }) => {
  return (
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
  );
};

export default FloatingMenu;
