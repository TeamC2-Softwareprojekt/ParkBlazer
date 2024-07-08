import React from 'react';
import './parkingSpaceListItem.css';
import {
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonIcon,
} from '@ionic/react';
import { map } from './map';
import { star, bicycleOutline, carOutline, busOutline, cardOutline, locationOutline, barChartOutline } from "ionicons/icons";
import { parkingSpace } from '../data/parkingSpaces';
import { getAverageRatingOfParkingspot, getReviewsOfParkingspot } from '../data/review';

function onItemClick(parkingSpace: parkingSpace) {
  map.current?.flyTo({ center: [parkingSpace.longitude, parkingSpace.latitude], zoom: 18 });
}

export default function ParkingSpaceListItem({ parkingSpace }: { parkingSpace: parkingSpace }) {
  return (
    <IonItem className="parking-space-list-item" button={true} onClick={() => onItemClick(parkingSpace)}>
      <div className="parking-space-list-container">
        <div className={`parking-space-list-private-indicator ${parkingSpace.price_per_hour ? "private" : "public"}`} />
        <div className="parking-space-list-address-container">
          <div id="parking-space-list-rating">
            <IonLabel>{parkingSpace.street + " " + parkingSpace.house_number},</IonLabel>
            {!!getReviewsOfParkingspot(parkingSpace.parkingspot_id).length && (
              <>
                <IonIcon icon={star} />
                <IonLabel>{getAverageRatingOfParkingspot(parkingSpace.parkingspot_id)}</IonLabel>
              </>
            )}
          </div>
          <IonLabel>{parkingSpace.city + " " + parkingSpace.zip}</IonLabel>
        </div>
        <div className="parking-space-list-detail-container">
          <RadioType icon={bicycleOutline} isEnabled={parkingSpace.type_bike} />
          <RadioType icon={carOutline} isEnabled={parkingSpace.type_car} />
          <RadioType icon={busOutline} isEnabled={parkingSpace.type_truck} />
          {!!parkingSpace.available_spaces && (
            <ListDetail icon={barChartOutline} text={parkingSpace.available_spaces.toString()} />
          )}
          {!!parkingSpace.distance && (
            <ListDetail icon={locationOutline} text={parkingSpace.distance?.toFixed(0) + " km"} />
          )}
          {!!parkingSpace.price_per_hour && (
            <ListDetail icon={cardOutline} text={parkingSpace.price_per_hour + "€"} />
          )}
        </div>
      </div>
    </IonItem>
  );
}

function RadioType({ icon, isEnabled }: { icon: any, isEnabled: number }) {
  return (
    <div className="parking-space-list-detail">
      <IonIcon className="parking-space-list-icon" icon={icon} />
      <IonRadioGroup value={isEnabled}>
        <IonRadio className="parking-space-list-radio" value={1} disabled />
      </IonRadioGroup>
    </div>
  );
}

function ListDetail({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="parking-space-list-detail">
      <IonIcon className="parking-space-list-icon" icon={icon} />
      <IonLabel>{text}</IonLabel>
    </div>
  );
}