import React, { useState, useEffect } from "react";
import {
    IonCol,
    IonGrid,
    IonRow,
    IonAlert,
    IonText,
    IonThumbnail,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonIcon,
    IonContent,
    IonSpinner,
    IonPage
} from "@ionic/react";
import axios from "axios";
import "./UserParkingspots.css";
import AuthService from "../utils/AuthService";
import Navbar from "../components/navbar";
import { parkingspaces, initParkingSpaces } from "../data/parkingSpaces";
import { informationCircleOutline, settingsOutline, trashOutline } from "ionicons/icons";

const UserProfile: React.FC = () => {

    const [error, setError] = useState<string>("");
    const [parkingSpots, setParkingSpots] = useState<any[]>([]);
    const [selectedParkingSpot, setSelectedParkingSpot] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchParkingSpots = async (username: any) => {
            try {
                setLoading(true);
                await initParkingSpaces();
                const userParkingSpots = parkingspaces.filter(spot => spot.username === username);
                setParkingSpots(userParkingSpots);
                setLoading(false);
            } catch (error) {
                setError("Error loading the parkingspots!");
                setLoading(false);
            }
        };
        fetchParkingSpots(localStorage.getItem('username'));
    }, []);

    const handleError = (error: any) => {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError("An unexpected error occurred. Please try again later!");
        }
    };

    const handleDeleteParkingspot = async () => {
        if (!selectedParkingSpot) {
            return
        }
        try {
            const token = AuthService.getToken();
            await axios.delete(`https://server-y2mz.onrender.com/api/delete_parkingspot/${selectedParkingSpot.parkingspot_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedSpots = parkingSpots.filter(spot => spot.parkingspot_id !== selectedParkingSpot.parkingspot_id);
            setParkingSpots(updatedSpots);
            setSelectedParkingSpot(null);
            setError("");
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <IonPage>
            <Navbar />
            <IonContent
                class="main-content"
            >
                <IonGrid fixed className="userparkingspots-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                        <IonCol className="userparkingspots-col" size="12" size-sm="12" size-md="12">
                            <IonText color="primary" className="userparkingspots-title">
                                <h1 className="userparkingspots-heading">Deine angelegten Parkplätze</h1>
                            </IonText>
                            {loading ? (
                                <IonCard>
                                    <IonCardContent>
                                        <IonText className="no-parkingspots-text" color="medium">Laden...</IonText>
                                        <IonSpinner name="crescent" />
                                    </IonCardContent>
                                </IonCard>
                            ) : (
                                <>
                                    {parkingSpots.length === 0 ? (
                                        <IonCard>
                                            <IonCardContent>
                                                <IonText className="no-parkingspots-text" color="medium">Noch keine Parkplätze angelegt.</IonText>
                                            </IonCardContent>
                                        </IonCard>
                                    ) : (
                                        <>
                                            {parkingSpots.map((spot, index) => (
                                                <IonCard key={index}>
                                                    <IonCardContent>
                                                        <IonList>
                                                            <IonItem>
                                                                <IonThumbnail slot="start">
                                                                    <img src={spot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} alt={`Thumbnail of ${spot.name}`} />
                                                                </IonThumbnail>
                                                                <IonLabel>{spot.name}</IonLabel>
                                                                <IonIcon id="icon-parkingspot-details" icon={informationCircleOutline} onClick={() => window.open(`/parkingspot_details/${spot.parkingspot_id}`, '_self')} size="medium" color="primary"></IonIcon>
                                                                <IonIcon id="icon-parkingspot-edit" icon={settingsOutline} onClick={() => window.open(`/parkingspot_edit/${spot.parkingspot_id}`, '_self')} size="medium" color="primary"></IonIcon>
                                                                <IonIcon icon={trashOutline} onClick={() => setSelectedParkingSpot(spot)} size="medium" color="primary"></IonIcon>
                                                            </IonItem>
                                                        </IonList>
                                                    </IonCardContent>
                                                </IonCard>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonAlert
                header="Parkplatz löschen"
                isOpen={!!selectedParkingSpot}
                buttons={[
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => setSelectedParkingSpot(null)
                    },
                    {
                        text: 'Löschen',
                        role: 'confirm',
                        handler: handleDeleteParkingspot
                    },
                ]}
                message={`Soll ${selectedParkingSpot?.name} gelöscht werden?`}
            ></IonAlert>
        </IonPage>
    );

};

export default UserProfile;
