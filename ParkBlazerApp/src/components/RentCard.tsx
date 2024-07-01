import React, { useState, useEffect } from "react";
import { IonButton, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from "@ionic/react";
import "./RentCard.css";
import { parkingSpace } from '../data/parkingSpaces';
import DateInput from "./DateInput";
import { useHistory } from "react-router";
import PriceCalculation from "./PriceCalculation";

export default function RentCard({ parkingspace }: { parkingspace: parkingSpace }) {
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const [rentTimeInHours, setRentTimeInHours] = useState<number>(0);
  const history = useHistory();

  useEffect(() => {
    if (!end_date || !start_date) return;
    setRentTimeInHours(parseFloat(((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60)).toFixed(2)));
  }, [start_date, end_date]);

  function handleRentClick(e: any) {
    history.push(`/Rent/${parkingspace.parkingspot_id}?start_date=${start_date?.toISOString()}&end_date=${end_date?.toISOString()}`);
    window.location.reload();
  }

  return (
    <IonCard id="rent-card">
      <IonCardHeader>
        <IonCardTitle>
          <IonLabel id="rent-card-price">
            {parkingspace.price_per_hour}€
          </IonLabel>
          pro Stunde
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <DateInput parkingspace={parkingspace} setStartDate={setStartDate} setEndDate={setEndDate} />
        <IonButton disabled={!start_date || !end_date} onClick={handleRentClick} id="rent-card-button">Mieten</IonButton>
        {rentTimeInHours < 0.5 ?
          (end_date ? <IonText color="danger">Mindestmietdauer: 30 Minuten</IonText> : "")
          : <PriceCalculation parkingspace={parkingspace} rentTimeInHours={rentTimeInHours} />
        }
      </IonCardContent>
    </IonCard>
  );
}