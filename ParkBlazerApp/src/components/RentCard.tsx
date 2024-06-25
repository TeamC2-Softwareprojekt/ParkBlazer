import React, { useState, useEffect } from "react";
import { IonButton, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import "./RentCard.css";
import { parkingSpace } from '../data/parkingSpaces';
import DateInput from "./DateInput";
import { useHistory } from "react-router";

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
    <>
      <IonCard id="rent-card">
        <IonCardContent>
          <IonCardHeader>
            <IonCardTitle>
              <div id="rent-card-price">
                {parkingspace?.price_per_hour}€
                <div id="rent-card-price-description">
                  pro Stunde
                </div>
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <DateInput parkingspace={parkingspace} setStartDate={setStartDate} setEndDate={setEndDate} />
            <IonButton onClick={e => handleRentClick(e)} id="rent-card-button" >Mieten</IonButton>
            {rentTimeInHours < 0.5 ?
              end_date ? <IonText color="danger">Mindestmietdauer: 30 Minuten</IonText> : "" :
              <div id="price-calculation-container">
                <div className="price-calculation">
                  <div>
                    {parkingspace?.price_per_hour + " € x " + rentTimeInHours + " Stunden"}
                  </div>
                  <div>
                    {(parkingspace.price_per_hour! * rentTimeInHours).toFixed(2) + "€"}
                  </div>
                </div>
                <div className="price-calculation">
                  <div>
                    Servicegebühr 10%
                  </div>
                  <div>
                    {(parkingspace.price_per_hour! * rentTimeInHours * 0.1).toFixed(2) + "€"}
                  </div>
                </div>
                <div className="price-calculation">
                  <div>
                    Steuern 19%
                  </div>
                  <div>
                    {(parkingspace.price_per_hour! * rentTimeInHours * 0.19).toFixed(2) + "€"}
                  </div>
                </div>
                <div className="price-calculation" id="rent-card-total-price">
                  <div>
                    Gesamtpreis
                  </div>
                  <div>
                    {(parkingspace.price_per_hour! * rentTimeInHours * 1.29).toFixed(2) + "€"}
                  </div>
                </div>
              </div>
            }
          </IonCardContent>
        </IonCardContent>
      </IonCard>
    </>)
}