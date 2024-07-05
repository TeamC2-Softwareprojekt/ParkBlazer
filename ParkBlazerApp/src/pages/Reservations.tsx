import React, { useState, useEffect } from "react";
import { IonAlert, IonIcon, IonModal, IonPage, IonPopover } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { cardOutline } from 'ionicons/icons';
import { bicycle, bus, car } from "ionicons/icons";
import {
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonText,
  IonThumbnail,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonContent,
} from "@ionic/react";
import axios from "axios";
import AuthService from "../utils/AuthService";
import "./Reservations.css";
import Navbar from "../components/navbar";
import { initParkingSpaces, parkingSpace, parkingspaces } from "../data/parkingSpaces";
import { format } from "date-fns";
import { Reservation, getCurrentUserReservations } from "../data/reservation";

const Reservations: React.FC = () => {
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [showPopoverImage, setShowPopoverImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const reservationsResponse = await getCurrentUserReservations();
      if (!reservationsResponse) {
        setError("An error occurred while fetching your reservations");
        return;
      }
      await initParkingSpaces();
      combineData(reservationsResponse, parkingspaces);
    };

    fetchData();
  }, []);

  const combineData = (reservations: Reservation[], parkingspots: parkingSpace[]) => {
    const combined = reservations.map(reservation => {
      const parkingspot = parkingspots.find(spot => spot.private_parkingspot_id === reservation.private_parkingspot_id);
      if (!parkingspot) throw new Error("Parkingspot not found");
      return { reservation, parkingspot };
    });
    setCombinedData(combined);
  };

  const openPopoverImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowPopoverImage(true);
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <IonGrid fixed className="login-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol size="12" size-sm="12" size-md="12">
              <IonText color="primary">
                <h1 className="reservation-heading">Reservierungen</h1>
              </IonText>
              <IonCard>
                <IonCardContent>
                  <IonList>
                    {combinedData && combinedData.map((data, index) => (
                      <IonItem key={index}>
                        <IonThumbnail slot="start" onClick={() => openPopoverImage(data.parkingspot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg")}>
                          <img alt={`Thumbnail of ${data.parkingspot.name}`} src={data.parkingspot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} />
                        </IonThumbnail>
                        <div className="data-row">
                          <IonLabel className="parkingspace-label" onClick={() => window.open(`/parkingspot_details/${data.parkingspot.parkingspot_id}`, '_self')}>{data.parkingspot.name}</IonLabel>
                          <IonLabel className="label-margin"><strong>Status:</strong> {data.reservation.status}</IonLabel>
                          <IonLabel className="label-margin"><strong>Start-Datum:</strong> {format(data.reservation.start_date, 'dd.MM.yyy hh:mm')} Uhr</IonLabel>
                          <IonLabel className="label-margin"><strong>End-Datum:</strong> {format(data.reservation.end_date, 'dd.MM.yyy hh:mm')} Uhr</IonLabel>
                          <IonIcon
                            icon={informationCircleOutline}
                            className="icon-style"
                            id={index.toString() + "-information"} />
                          <IonIcon
                            icon={cardOutline}
                            className="icon-style"
                            id={index.toString() + "-invoice"} />
                          {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
                        </div>
                        <PopoverInformation parkingspace={data.parkingspot!} trigger={index.toString() + "-information"} />
                        <PopoverInvoice reservationID={data.reservation.reservation_id} trigger={index.toString() + "-invoice"} />
                      </IonItem>
                    ))}
                  </IonList>
                  <IonModal isOpen={showPopoverImage} onDidDismiss={() => setShowPopoverImage(false)}>
                    <div className="image-style">
                      <img src={selectedImage} alt="Selected" style={{ maxHeight: '90%', maxWidth: '90%' }} />
                    </div>
                    <IonButton onClick={() => setShowPopoverImage(false)} expand="full">Schließen</IonButton>
                  </IonModal>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

function PopoverInformation({ parkingspace, trigger }: { parkingspace: parkingSpace, trigger: string }) {
  return (
    <IonPopover trigger={trigger} className="custom-modal">
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>
                <h1>Informationen: {parkingspace.name} </h1>
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>
                <h2>Parkmöglichkeiten</h2>
              </IonLabel>
              {parkingspace.type_car ? <IonIcon icon={car} size="large" color="primary"></IonIcon> : ""}
              {parkingspace.type_bike ? <IonIcon icon={bicycle} size="large" color="primary"></IonIcon> : ""}
              {parkingspace.type_truck ? <IonIcon icon={bus} size="large" color="primary"></IonIcon> : ""}
            </IonCol>
            <IonCol>
              <IonRow>
                <IonCol>
                  <IonLabel><strong>Freie parkplätze:</strong> {parkingspace.available_spaces}</IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Straße:</strong> {parkingspace.street}
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Hausnummer:</strong> {parkingspace.house_number}
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Preis pro Stunde:</strong> {parkingspace.price_per_hour}
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Zip:</strong> {parkingspace.zip}
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Stadt:</strong> {parkingspace.city}
                  </IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <strong>Land:</strong> {parkingspace.country}
                  </IonLabel>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPopover>
  );
}

function PopoverInvoice({ reservationID, trigger }: { reservationID: number, trigger: string }) {
  let [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  interface Invoice {
    invoice_id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    reservation_id: number;
    status: string;
  }

  useEffect(() => {
    async function fetchInvoiceDetails() {
      try {
        const response = await axios.get(`https://server-y2mz.onrender.com/api/reservation_invoice/${reservationID}`, {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`
          }
        });
        setSelectedInvoice(response.data);
      } catch (error: any) {
        if (error?.response?.data?.message) {
          console.error(error.response.data.message);
        } else {
          console.error("An unexpected error occurred. Please try again later!");
        }
      }
    };

    fetchInvoiceDetails();
  }, []);

  return (
    <IonPopover trigger={trigger} className="custom-modal">
      {selectedInvoice && (
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>
                  <h1>Rechnung</h1>
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>
                  Betrag: {selectedInvoice.amount} EUR
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>
                  Zahlungsmethode: {selectedInvoice.payment_method}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>
                  Zahlungsdatum: {selectedInvoice?.payment_date ? format(selectedInvoice.payment_date, 'dd.MM.yyy hh:mm') + " Uhr" : "Keine Zahlung"}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>
                  Status: {selectedInvoice.status}
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
    </IonPopover>
  );
}

export default Reservations;