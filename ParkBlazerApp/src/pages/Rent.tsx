import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonText } from "@ionic/react";
import { initParkingSpaces, parkingSpace, parkingspaces } from "../data/parkingSpaces";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useHistory, useParams } from "react-router";
import { format } from "date-fns";
import "./Rent.css";
import AuthService from "../utils/AuthService";
import { de } from 'date-fns/locale';
import StarRating from "../components/StarRating";
import axios from "axios";
import { adjustMinutes, findRestrictedDateInRange, adjustDateToAvailability } from "../utils/dateUtils";
import PriceCalculation from "../components/PriceCalculation";
import { createReservation, getReservedDates } from "../data/reservation";

export default function Rent() {
  const [parkingspace, setParkingspot] = useState<parkingSpace | null>(null);
  const [start_date, setStartDate] = useState<Date | null>();
  const [end_date, setEndDate] = useState<Date | null>();
  const [rentTimeInHours, setRentTimeInHours] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Paypal");
  const [reviews, setReviews] = useState<any>(null);
  const [restrictedDates, setRestrictedDates] = useState<Date[][] | null>(null);
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

    async function getParkingspot() {
      await initParkingSpaces();
      const parkingspotDetails = parkingspaces.find(ps => ps.parkingspot_id === Number(id));
      if (parkingspotDetails) {
        setParkingspot(parkingspotDetails);
        let data = await getReservedDates(parkingspace?.private_parkingspot_id!);
        setRestrictedDates(data.map(reservation => [new Date(reservation.start_date), new Date(reservation.end_date)]));
      }
    }

    async function fetchReviews() {
      try {
        const response = await axios.post('https://server-y2mz.onrender.com/api/get_reviews_of_parkingspot', {
          parkingspot_id: id
        });
        const reviewDetails = response.data;
        setReviews(reviewDetails);
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchReviews();
    getParkingspot();
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

  function calculateAverageRating(reviews: any[]) {
    if (!reviews || reviews.length === 0) return "No reviews yet";

    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 2) / 2;

    return (
      <StarRating rating={averageRating} />
    );
  };

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
    if (!await createReservation(start_date!, end_date!, parkingspace!, rentTimeInHours, paymentMethod)) {
      alert("Fehler beim Mieten des Parkplatzes");
      return;
    }
    handleRedirect("/home");
  }

  return (
    <>
      <Navbar />
      {!parkingspace && (
        <IonCard>
          <IonCardContent>
            <IonText color="medium">Daten werden geladen</IonText>
            <IonSpinner name="crescent" />
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
                    <IonButton disabled={!(rentTimeInHours > 0)} onClick={handleRentClick} id="rent-button">Mieten</IonButton> :
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
                      {calculateAverageRating(reviews)}
                    </div>
                  </IonCardHeader>
                  <IonCardContent id="information-card-content">
                    <IonLabel>Einzelheiten zum Preis</IonLabel>
                    {rentTimeInHours < 0.5 ?
                      !start_date && !end_date ?
                        <IonText color="danger">Invalides Datum</IonText> :
                        <IonText color="danger">Mindestmietdauer: 30 Minuten</IonText> :
                      <PriceCalculation parkingspace={parkingspace} rentTimeInHours={rentTimeInHours} />
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