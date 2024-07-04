import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonContent, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonText } from "@ionic/react";
import axios from "axios";
import { format } from "date-fns";
import { de } from 'date-fns/locale';
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Navbar from "../components/navbar";
import PriceCalculation from "../components/PriceCalculation";
import StarRating from "../components/StarRating";
import { initParkingSpaces, parkingSpace, parkingspaces } from "../data/parkingSpaces";
import { createReservation, getReservedDates } from "../data/reservation";
import { getAverageRatingOfParkingspot, initReviews } from "../data/review";
import AuthService from "../utils/AuthService";
import { adjustDateToAvailability, adjustMinutes, findRestrictedDateInRange } from "../utils/dateUtils";
import "./Rent.css";

export default function Rent() {
  const [parkingspace, setParkingspot] = useState<parkingSpace | null>(null);
  const [start_date, setStartDate] = useState<Date | null>();
  const [end_date, setEndDate] = useState<Date | null>();
  const [rentTimeInHours, setRentTimeInHours] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Paypal");
  const [restrictedDates, setRestrictedDates] = useState<Date[][] | null>(null);
  const [error, setError] = useState<string>("");
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let startDate = new Date(String(queryParams.get("start_date")));
    let endDate = new Date(String(queryParams.get("end_date")));

    startDate = adjustMinutes(startDate);
    endDate = adjustMinutes(endDate);
    setStartDate(startDate);
    setEndDate(endDate);

    async function fetchData() {
      await initParkingSpaces();
      await initReviews();
      const parkingspotDetails = parkingspaces.find(ps => ps.parkingspot_id === Number(id));
      if (parkingspotDetails) {
        setParkingspot(parkingspotDetails);
        let data = await getReservedDates(parkingspace?.private_parkingspot_id!);
        setRestrictedDates(data.map(reservation => [new Date(reservation.start_date), new Date(reservation.end_date)]));
      } else {
        setError("Parkingspot not found");
        return;
      }

      try {
        const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`
          }
        });
        setPoints(response.data.userDetails[0].points);
      } catch (error) {
        console.error('Error while fetching user data', error);
        setError("Error while fetching user data");
        return;
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!start_date && !end_date) return;
    if (!validateDates(start_date!, end_date!)) {
      setStartDate(null);
      setEndDate(null);
    } else {
      setRentTimeInHours(parseFloat(((end_date!.getTime() - start_date!.getTime()) / (1000 * 60 * 60)).toFixed(2)));
    }
  }, [restrictedDates]);

  function validateDates(startDate: Date, endDate: Date) {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }
    else if (findRestrictedDateInRange(startDate, endDate, restrictedDates!)) {
      return false;
    }
    else if (adjustDateToAvailability(startDate, parkingspace!, true).toDateString() !== startDate.toDateString() || adjustDateToAvailability(endDate, parkingspace!, false).toDateString() !== endDate.toDateString()) {
      return false;
    }
    return true;
  }

  function handleRedirect(location: string) {
    history.push(location);
    window.location.reload();
  }

  async function handleRentClick() {
    if (!await createReservation(start_date!, end_date!, parkingspace!, price, paymentMethod)) {
      alert("Fehler beim Mieten des Parkplatzes");
      return;
    }
    if (usePoints) {
      // TODO remove points
    }
    handleRedirect("/home");
  }

  return (
    <>
      <Navbar />
      {!parkingspace && !error && (
        <IonCard>
          <IonCardContent>
            <IonText color="medium">Daten werden geladen</IonText>
            <IonSpinner name="crescent" />
          </IonCardContent>
        </IonCard>
      )}

      {error && (
        <IonCard>
          <IonCardContent>
            <IonText color="danger">{error}</IonText>
          </IonCardContent>
        </IonCard>
      )}

      {parkingspace && !parkingspace.price_per_hour && (
        <IonCard>
          <IonCardContent>
            <IonText color="danger">Keine Privaten Parkplätze mit der ID:{parkingspace.parkingspot_id} gefunden</IonText>
          </IonCardContent>
        </IonCard>
      )}

      {parkingspace && parkingspace.price_per_hour && (
        <IonContent>
          <div id="rent-container">
            <div>
              <div id="rent-header">
                Bestätigen und bezahlen
              </div>
              <div id="rent-body">
                <div id="rent-information-container">
                  <div id="information-list-container">
                    <div className="list-item">
                      <IonLabel className="list-header">Datum</IonLabel>
                      <div className="list-content">
                        {end_date && start_date ?
                          start_date.toDateString() === end_date.toDateString() ? format(end_date, 'dd. MMMM', { locale: de })
                            : format(start_date, 'dd.') + " - " + format(end_date, 'dd. MMMM', { locale: de })
                          : ""}
                        <br />
                        {end_date && start_date ? format(start_date, 'HH:mm') + " Uhr - " + format(end_date, 'HH:mm') + " Uhr" : ""}
                      </div>
                    </div>
                    <div className="list-item">
                      <IonLabel className="list-header">Länge</IonLabel>
                      <div className="list-content">
                        {rentTimeInHours ?
                          rentTimeInHours < 1 ? `${Math.round(rentTimeInHours * 60)} Minuten`
                            : `${Math.floor(rentTimeInHours)}:${(rentTimeInHours % 1) * 60 < 10 ? '0' : ''}${Math.round((rentTimeInHours % 1) * 60)} Stunden`
                          : "0 Minuten"}
                      </div>
                    </div>
                  </div>
                  <div id="payment-method">
                    <div id="payment-method-header">Wähle deine Zahlungsart</div>
                    <IonSelect onIonChange={e => setPaymentMethod(e.target.value)} placeholder="Paypal" labelPlacement="stacked" interface="popover" fill="outline">
                      <IonSelectOption value="Paypal">Paypal</IonSelectOption>
                      <IonSelectOption value="Kreditkarte">Kreditkarte</IonSelectOption>
                      <IonSelectOption value="Sofortüberweisung">Sofortüberweisung</IonSelectOption>
                    </IonSelect>
                  </div>
                  {AuthService.isLoggedIn() ?
                    <>
                      <div id="user-point-selection-container">
                        <IonLabel>Möchten sie ihre Punkte gegen einen Rabatt eintauschen?</IonLabel>
                        <IonCheckbox onIonChange={e => { setUsePoints(!usePoints) }} />
                      </div>
                      <IonButton disabled={!(rentTimeInHours > 0)} onClick={handleRentClick} id="rent-button">Mieten</IonButton>
                    </> :
                    <>
                      <div id="login-warning">Logge dich ein oder registriere dich, um zu Mieten</div>
                      <div id="login-register-buttons">
                        <IonButton onClick={e => handleRedirect("/login")}>Login</IonButton>
                        <IonButton onClick={e => handleRedirect("/registration")}>Registrierung</IonButton>
                      </div>
                    </>}
                </div>

                <IonCard id="information-card">
                  <IonCardHeader id="information-card-header">
                    <img alt="Parkingspot Image" src={parkingspace?.image_url} id="information-card-parkingspace-image" />
                    <div>
                      <strong>{parkingspace?.name}</strong> <br />
                      {parkingspace?.city + " " + parkingspace?.zip + ", " + parkingspace?.street + " " + parkingspace?.house_number} <br />
                      <StarRating rating={getAverageRatingOfParkingspot(parkingspace?.parkingspot_id)} />
                    </div>
                  </IonCardHeader>
                  <IonCardContent id="information-card-content">
                    <IonLabel>Einzelheiten zum Preis</IonLabel>
                    {rentTimeInHours < 0.5 ?
                      !start_date && !end_date ?
                        <IonText color="danger">Invalides Datum</IonText> :
                        <IonText color="danger">Mindestmietdauer: 30 Minuten</IonText> :
                      <PriceCalculation parkingspace={parkingspace} rentTimeInHours={rentTimeInHours} pointAmount={usePoints ? points : 0} setTotalPrice={setPrice} />
                    }
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
          </div>
        </IonContent>
      )}
    </>);
}