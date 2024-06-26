import React from 'react';
import './parkingSpaceListItem.css';
import {
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonIcon
} from '@ionic/react';
import { map } from './map';

function onItemClick(parkingSpace: any) {
  map.current?.flyTo({ center: [parkingSpace.longitude, parkingSpace.latitude], zoom: 18 });
}

export default function ParkingSpaceListItem({ parkingSpace }: any) {
  return (
    <IonItem className="parking-space-list-item" button={true} onClick={() => onItemClick(parkingSpace)}>
      <div className="parking-space-list-container">
        <div className="parking-space-list-private-indicator" style={{ backgroundColor: parkingSpace.price_per_hour ? "#1BB367" : "#4d8dff" }}></div>
        <div className="parking-space-list-address-container">
          <IonLabel>{parkingSpace.street + " " + parkingSpace.house_number},</IonLabel>
          <IonLabel>{parkingSpace.city + " " + parkingSpace.zip}</IonLabel>
        </div>
        <div className="parking-space-list-detail-container">
          <div className="parking-space-list-detail">
            <IonIcon className="parking-space-list-icon" src="src/icons/bike.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_bike ? true : false}>
              <IonRadio className="parking-space-list-radio" value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="parking-space-list-detail">
            <IonIcon className="parking-space-list-icon" src="src/icons/car.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_car ? true : false}>
              <IonRadio className="parking-space-list-radio" value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="parking-space-list-detail">
            <IonIcon className="parking-space-list-icon" src="src/icons/truck.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_truck ? true : false}>
              <IonRadio className="parking-space-list-radio" value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="parking-space-list-detail">
            <IonIcon className="parking-space-list-icon" src="src/icons/amount.svg"></IonIcon>
            <IonLabel>{parkingSpace.available_spaces}</IonLabel>
          </div>
          <div className="parking-space-list-detail" style={{ display: parkingSpace.distance ? '' : 'none' }}>
            <IonIcon className="parking-space-list-icon" src="src/icons/distance.svg"></IonIcon>
            <IonLabel>{parseInt(parkingSpace.distance)} km</IonLabel>
          </div>
          <div className="parking-space-list-detail" style={{ display: parkingSpace.price_per_hour ? '' : 'none' }}>
            <IonIcon className="parking-space-list-icon" src="src/icons/euro.svg"></IonIcon>
            <IonLabel>{parkingSpace.price_per_hour}€</IonLabel>
          </div>
        </div>
      </div>
    </IonItem>
  );
}