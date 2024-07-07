import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonAlert,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonIcon,
  IonInput,
  IonModal,
  IonImg,
  IonToggle,
} from "@ionic/react";
import "./ParkingspotDetails.css";
import Navbar from "../components/navbar";
import { bicycle, bus, car } from "ionicons/icons";
import AuthService from "../utils/AuthService";
import StarRating from "../components/StarRating";
import { parkingSpace, parkingspaces, initParkingSpaces } from '../data/parkingSpaces';
import RentCard from "../components/RentCard";
import { createReview, getAverageRatingOfParkingspot, getReviewsOfParkingspot, initReviews } from "../data/review";

const ParkingspotDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parkingspot, setParkingspot] = useState<parkingSpace | null>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");

  useEffect(() => {
    const fetchParkingspotDetails = () => {
      const parkingspotDetails = parkingspaces.find(ps => ps.parkingspot_id === parseInt(id));
      if (parkingspotDetails) {
        setParkingspot(parkingspotDetails);
      } else {
        setError("Parkingspot not found.");
      }
    };

    initReviews().then(() => setReviews(getReviewsOfParkingspot(parseInt(id))));
    initParkingSpaces().then(fetchParkingspotDetails);
  }, [id]);

  const handleRatingSubmit = async () => {
    setAlert(await createReview(rating, comment, parseInt(id)));
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setShowModal(true);
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return "Keine Bewertungen vorhanden.";

    const averageRating = getAverageRatingOfParkingspot(parseInt(id));
    const averageRatingRound = Math.round(averageRating * 2) / 2;

    return (
      <>
        <StarRating rating={averageRatingRound} />
        <strong>{averageRating} / 5</strong>
      </>
    );
  };

  return (
    <IonPage>
      <Navbar />
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}
      {(!parkingspot || !reviews) && !error && (
        <IonText color="primary">
          <p>Daten werden geladen...</p>
        </IonText>
      )}
      {parkingspot && reviews && (
        <IonContent className="parkingspotdetails-content ion-padding">
          <IonCard>
            <img alt="Parkplatz Bild" src={parkingspot.image_url} onClick={() => openModal(parkingspot.image_url)} />
            <IonCardHeader>
              <IonCardTitle className="card-title">{parkingspot.name}</IonCardTitle>
              <IonCardSubtitle>{parkingspot.description}</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <div id="parkingspotdetails-rent-container">
            <div id="parkingspotdetails-container">
              <IonCard>
                <IonCardContent id="average-rating">
                  <IonCardTitle>Durchschnittliche Bewertung:</IonCardTitle>
                  {getAverageRating()}
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent>
                  <IonCardTitle>Verfügbare Parkplatztypen:</IonCardTitle>
                  {parkingspot.type_car ? <IonIcon icon={car} size="large" color="primary"></IonIcon> : ""}
                  {parkingspot.type_bike ? <IonIcon icon={bicycle} size="large" color="primary"></IonIcon> : ""}
                  {parkingspot.type_truck ? <IonIcon icon={bus} size="large" color="primary"></IonIcon> : ""}
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent>
                  <IonCardTitle>Verfügbare Parkplätze:</IonCardTitle>
                  <IonText><strong>{parkingspot.available_spaces}</strong></IonText>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent>
                  <IonCardTitle>Adresse:</IonCardTitle>
                  <IonText><strong>Straße:</strong> {parkingspot.street}</IonText>
                  <br></br>
                  <IonText><strong>Hausnummer:</strong> {parkingspot.house_number}</IonText>
                  <br></br>
                  <IonText><strong>PLZ:</strong> {parkingspot.zip}</IonText>
                  <br></br>
                  <IonText><strong>Stadt:</strong> {parkingspot.city}</IonText>
                  <br></br>
                  <IonText><strong>Land:</strong> {parkingspot.country}</IonText>
                </IonCardContent>
              </IonCard>
            </div>
            {!!parkingspot.price_per_hour &&
              <RentCard parkingspace={parkingspot} />
            }
          </div>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Bewertungen:</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid className="reviews">
                {reviews.map((review: any, index: any) => (
                  <IonRow key={index}>
                    <IonCol>
                      <IonText><strong>{review.username}</strong></IonText>
                      <StarRating rating={review.rating} />
                      <IonText>{review.comment}</IonText>
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {AuthService.isLoggedIn() && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Bewerte den Parkplatz:</IonCardTitle>
              </IonCardHeader>
              <IonCardContent id="rate-parkingspot">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonText>Bewertung (1-5):</IonText>
                      <StarRating rating={rating} onRatingChange={setRating} /> { }
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonText>Kommentar:</IonText>
                      <IonInput value={comment} onIonChange={e => setComment(e.detail.value!)}></IonInput>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonButton onClick={handleRatingSubmit}>Bewerten</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          )}

          <IonAlert
            isOpen={alert}
            onDidDismiss={() => window.location.reload()}
            header={"Erfolgreich!"}
            message={"Vielen Dank für deine Bewertung, sie wurde erfolgreich gespeichert."}
            buttons={["OK"]}
          />

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonContent>
              <IonImg src={modalImage} />
            </IonContent>
          </IonModal>
        </IonContent>
      )}
    </IonPage>
  );
};

export default ParkingspotDetails;
