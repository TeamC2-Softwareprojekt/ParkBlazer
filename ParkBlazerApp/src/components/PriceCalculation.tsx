import { IonLabel } from "@ionic/react";
import { parkingSpace } from "../data/parkingSpaces";
import "./PriceCalculation.css";

export default function PriceCalculation({ parkingspace, rentTimeInHours }: { parkingspace: parkingSpace, rentTimeInHours: number }) {
  return (
    <div id="price-calculation-container">
      <div className="price-calculation">
        <IonLabel>{parkingspace.price_per_hour + " € x " + rentTimeInHours + " Stunden"}</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours).toFixed(2) + "€"}
      </div>
      <div className="price-calculation">
        <IonLabel>Servicegebühr 10%</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours * 0.1).toFixed(2) + "€"}
      </div>
      <div className="price-calculation">
        <IonLabel>Steuern 19%</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours * 0.19).toFixed(2) + "€"}
      </div>
      <div className="price-calculation" id="rent-card-total-price">
        <IonLabel>Gesamtpreis</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours * 1.29).toFixed(2) + "€"}
      </div>
    </div>
  )
}