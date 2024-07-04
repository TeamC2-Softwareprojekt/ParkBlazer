import { IonLabel } from "@ionic/react";
import { useEffect, useState } from "react";
import { parkingSpace } from "../data/parkingSpaces";
import "./PriceCalculation.css";

export default function PriceCalculation({ parkingspace, rentTimeInHours, pointAmount = 0, setTotalPrice }: { parkingspace: parkingSpace, rentTimeInHours: number, pointAmount?: number, setTotalPrice?: (price: number) => void }) {
  const pointValue = 0.01; // 1 Point = 0.01€
  const serviceFee = 0.1;
  const tax = 0.19;
  const finalPrice = 1 + serviceFee + tax;

  const [totalPrice, setThisTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    setThisTotalPrice(parkingspace.price_per_hour! * rentTimeInHours * finalPrice);
    setDiscount(pointAmount * pointValue);
  }, [pointAmount, parkingspace.price_per_hour, rentTimeInHours]);

  useEffect(() => {
    setTotalPrice?.(totalPrice - discount);
  }, [discount, totalPrice, setTotalPrice]);

  return (
    <div id="price-calculation-container">
      <div className="price-calculation">
        <IonLabel>{parkingspace.price_per_hour + " € x " + rentTimeInHours + " Stunden"}</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours).toFixed(2) + "€"}
      </div>
      <div className="price-calculation">
        <IonLabel>Servicegebühr {serviceFee * 100}%</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours * serviceFee).toFixed(2) + "€"}
      </div>
      <div className="price-calculation">
        <IonLabel>Steuern {tax * 100}%</IonLabel>
        {(parkingspace.price_per_hour! * rentTimeInHours * tax).toFixed(2) + "€"}
      </div>
      {pointAmount > 0 && (
        <div className="price-calculation">
          <IonLabel>{pointAmount} Punkte</IonLabel>
          -{discount.toFixed(2) + "€"}
        </div>
      )}
      <div className="price-calculation" id="rent-card-total-price">
        <IonLabel>Gesamtpreis</IonLabel>
        {(totalPrice - discount).toFixed(2) + "€"}
      </div>
    </div>
  )
}