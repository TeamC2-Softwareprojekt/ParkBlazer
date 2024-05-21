import React from 'react';
import './parkingSpaceList.css';
import { getParkingSpaces } from '../data/parkingSpaces';
import ParkingSpaceListItem from './parkingSpaceListItem';
import {
  IonContent,
  IonList,
} from '@ionic/react';

const parkingSpaces = getParkingSpaces();

export default function ParkingSpaceList() {
  return (
    <IonContent>
      <IonList>
        {parkingSpaces.map((parkingSpace) => (
          <ParkingSpaceListItem key={parkingSpace.id} {...parkingSpace} />
        ))}
      </IonList>
    </IonContent>
  );
}