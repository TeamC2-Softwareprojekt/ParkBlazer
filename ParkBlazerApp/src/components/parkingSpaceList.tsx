import React from 'react';
import './parkingSpaceList.css';
import { getParkingSpaces } from '../data/parkingSpaces';
import { map } from './map';
import * as maptilersdk from '@maptiler/sdk';
import {
  IonContent,
  IonList,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonIcon
} from '@ionic/react';

let marker: maptilersdk.Marker;

const parkingSpaces = getParkingSpaces().map((parkingSpace) => {
  return (
    <IonItem button={true} onClick={() => onItemClick(parkingSpace)}>
      <div className="parkingSpace-container">
        <div className="private-indicator" style={{backgroundColor: parkingSpace.private ? "#1BB367": "#4d8dff"}}></div>
        <div className="address-container">
          <IonLabel>{parkingSpace.adress},</IonLabel>
          <IonLabel>{parkingSpace.city}</IonLabel>
        </div>
        <div className="detail-container">
          <div className="detail">
            <IonIcon src="src/icons/bike.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_bike}>
              <IonRadio value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="detail">
            <IonIcon src="src/icons/car.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_car}>
              <IonRadio value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="detail">
            <IonIcon src="src/icons/truck.svg"></IonIcon>
            <IonRadioGroup value={parkingSpace.type_truck}>
              <IonRadio value={true} disabled></IonRadio>
            </IonRadioGroup>
          </div>
          <div className="detail">
            <IonIcon src="src/icons/amount.svg"></IonIcon>
            <IonLabel>{parkingSpace.amount}</IonLabel>
          </div>
          <div className="detail" style={{visibility: parkingSpace.private  ? 'visible' : 'hidden'}}>
            <IonIcon src="src/icons/euro.svg"></IonIcon>
            <IonLabel>{parkingSpace.price}€</IonLabel>
          </div>
        </div>
      </div>
    </IonItem>
  );
});

function onItemClick(parkingSpace: any) {
  map.current?.flyTo({center: parkingSpace.center, zoom: 18});
 
  if(marker) marker.remove();
  
  marker = new maptilersdk.Marker()
    .setLngLat(parkingSpace.center)
    .addTo(map.current!);
}

export default function ParkingSpaceList() {
  return (
    <IonContent>
      <IonList>
        {parkingSpaces}
      </IonList>
    </IonContent>
  );
}