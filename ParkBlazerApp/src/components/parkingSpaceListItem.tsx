import React from 'react';
import './parkingSpaceListItem.css';
import {
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonItem,
    IonIcon
} from '@ionic/react';
import * as maptilersdk from '@maptiler/sdk';
import { map } from './map';

let marker: maptilersdk.Marker;

function onItemClick(parkingSpace: any) {
    map.current?.flyTo({center: [parkingSpace.longitude, parkingSpace.latitude], zoom: 18});

    if(marker) marker.remove();

    marker = new maptilersdk.Marker()
      .setLngLat([parkingSpace.longitude, parkingSpace.latitude])
      .addTo(map.current!);
}

export default function ParkingSpaceListItem({parkingSpace}: any) {
    return (
        <IonItem className="parking-space-list-item" button={true} onClick={() => onItemClick(parkingSpace)}>
          <div className="parking-space-list-container">
            {/* TODO unterscheidung zwischen privat und public */}
            {/* <div className="private-indicator" style={{backgroundColor: parkingSpace.private ? "#1BB367": "#4d8dff"}}></div> */}
            <div className="parking-space-list-private-indicator" style={{backgroundColor: "#1BB367"}}></div> {/* REMOVE */}
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
              {/* TODO unterscheidung zwischen privat und public */}
              {/* <div className="detail" style={{display: parkingSpace.private  ? '' : 'none'}}> */}
              <div className="parking-space-list-detail" style={{display: 'none'}}> 
                <IonIcon className="parking-space-list-icon" src="src/icons/euro.svg"></IonIcon>
                <IonLabel>{parkingSpace.price}€</IonLabel> {/* TODO kein preis */}
              </div>
              <div className="parking-space-list-detail" style={{display: parkingSpace.distance  ? '' : 'none'}}>
                <IonIcon className="parking-space-list-icon" src="src/icons/distance.svg"></IonIcon>
                <IonLabel>{parseInt(parkingSpace.distance)} km</IonLabel>
              </div>
            </div>
          </div>
        </IonItem>
    );
}