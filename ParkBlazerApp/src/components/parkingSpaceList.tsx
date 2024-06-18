import React from 'react';
import './parkingSpaceList.css';
import { parkingSpace } from '../data/parkingSpaces';
import ParkingSpaceListItem from './parkingSpaceListItem';
import {
  IonContent,
  IonList,
} from '@ionic/react';


export default function ParkingSpaceList({ list }: { list: parkingSpace[] }) {
  return (
    <IonContent id="parking-space-list-container">
      <IonList id="parking-space-list">
        {list?.map((parkingSpace) => (
          <ParkingSpaceListItem key={parkingSpace.parkingspot_id} parkingSpace={parkingSpace} />
        ))}
      </IonList>
    </IonContent>
  );
}