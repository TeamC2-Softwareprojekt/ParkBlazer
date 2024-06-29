import React, { useState, useEffect, useCallback } from "react";
import { IonIcon } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import { trashBin } from 'ionicons/icons';
import { cardOutline } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { bicycle, bus, car } from "ionicons/icons";
import {
    IonInput,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
    IonAlert,
    IonText,
    IonSelect,
    IonSelectOption,
    IonThumbnail,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonModal,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import axios from "axios";
import AuthService from "../utils/AuthService";
import "./OwnReservations.css";
import Navbar from "../components/navbar";
import { parkingSpace, parkingspaces } from "../data/parkingSpaces";


const OwnReservations: React.FC = () => {

    interface Reservation {
    reservation_id: number;
    status: string;
    start_date: string;
    end_date: string;
    timestamp: string;
    private_parkingspot_id: number;
    user_id: number;
    }   


    interface Parkingspot {
    available_spaces: number;
    city: string;
    country: string;
    description: string;
    house_number: string;
    image_url: string;
    latitude: number;
    longitude: number;
    name: string;
    parkingspot_id: number;
    street: string;
    type_bike: number;
    type_car: number;
    type_truck: number;
    username: string;
    zip: string;
    distance?: number;
    price_per_hour?: number;
    availability_start_date?: string;
    availability_end_date?: string;
    }

    interface CombinedData {
    reservation: Reservation;
    parkingspot: Parkingspot;
    }

    interface Invoice {
        invoice_id: number;
        amount: number;
        payment_method: string;
        payment_date: string;
        reservation_id: number;
        status: string;
    }

    
   
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalTwo, setShowModalTwo] = useState<boolean>(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [currentParkingSpot, setcurrentParkingspot] = useState<Parkingspot | null>(null);
    
    function setError(message: any) {
        throw new Error("Function not implemented.");
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const token = AuthService.getToken();
            try {
                
                const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const reservationsResponse = await axios.get('https://server-y2mz.onrender.com/api/user_reservations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const reservations: Reservation[] = reservationsResponse.data;
                const allparkingspaces: Parkingspot[] = parkingspaces;

                combineData(reservations, allparkingspaces);
                
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError("An unexpected error occurred. Please try again later!");
                }
            }
        };

        fetchUserData();
    }, []);

    const combineData = (reservations: Reservation[], parkingspots: Parkingspot[]) => {
        const combined = reservations.map(reservation => {
            const parkingspot = parkingspots.find(spot => spot.parkingspot_id === reservation.private_parkingspot_id);
            return { reservation, parkingspot: parkingspot! };
        });
        setCombinedData(combined);
    };

    
    const fetchInvoiceDetails = async (reservationId: number) => {
        const token = AuthService.getToken();
        try {
            const response = await axios.get(`https://server-y2mz.onrender.com/api/reservation_invoice/${reservationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSelectedInvoice(response.data);
            setShowModal(true);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later!");
            }
        }
    };

    const fetchCurrentParkingspot = (spot: Parkingspot) => {
        setcurrentParkingspot(spot);
        setShowModalTwo(true);
    }

    
    return(
        <>
        <Navbar/>
            <IonGrid>
                <IonRow>
                    <IonCol size="12" size-sm="8" size-md="8">
                        <IonCard>
                            <IonCardContent>
                            <div className="reservation-container">
                            <IonText color="primary" className="profile-title">
                                <h1 className="reservation-heading">Reservierungen</h1>
                            </IonText>
                            <IonList>
                                    {combinedData && combinedData.map((data, index)  => (
                                        <IonItem key={index}>
                                            <IonThumbnail slot="start">
                                                <img alt={`Thumbnail of ${data.parkingspot.name}`} src={data.parkingspot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} />
                                            </IonThumbnail>
                                            <IonLabel onClick={() => window.open(`http://localhost:8100/parkingspot_details/${data.parkingspot.parkingspot_id}`, '_self')}>{data.parkingspot.name}</IonLabel>
                                            <IonIcon
                                                icon={informationCircleOutline}
                                                onClick={() => fetchCurrentParkingspot(data.parkingspot)}
                                                style={{ marginLeft: '4px', cursor: 'pointer', color: 'white' }} 
                                            />

                                            <IonIcon 
                                                icon={cardOutline} 
                                                onClick={() => fetchInvoiceDetails(data.reservation.reservation_id)} 
                                                style={{ marginLeft: '4px', cursor: 'pointer', color: 'white' }} 
                                            />

                                                <IonLabel>{data.reservation.status}</IonLabel>
                                                <IonLabel>{data.reservation.start_date}</IonLabel>
                                                <IonLabel>{data.reservation.end_date}</IonLabel>
                                                <IonIcon icon={trashBin} style={{ fontSize: '24px', color: 'white' }} />                                               
                                        </IonItem>
                                    ))}
                                <IonModal isOpen={showModalTwo} onDidDismiss={() => setShowModalTwo(false)} className="custom-modal">                                
                                <IonContent>
                                {currentParkingSpot ? (
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>
                                                <h1>Informationen:   {currentParkingSpot.name} </h1>
                                            </IonLabel>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>
                                                <h2>Parkmöglichkeiten</h2>
                                            </IonLabel>
                                            {currentParkingSpot.type_car ? <IonIcon icon={car} size="large" color="primary"></IonIcon> : ""}
                                            {currentParkingSpot.type_bike ? <IonIcon icon={bicycle} size="large" color="primary"></IonIcon> : ""}
                                            {currentParkingSpot.type_truck ? <IonIcon icon={bus} size="large" color="primary"></IonIcon> : ""}
                                        </IonCol>
                                        <IonCol>
                                            <IonRow>    
                                                <IonCol>       
                                                    <IonLabel><strong>Freie parkplätze:</strong> {currentParkingSpot.available_spaces}</IonLabel>                                                                                       
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>    
                                                <IonCol> 
                                                    <IonLabel>      
                                                        <strong>Street:</strong> {currentParkingSpot.street}
                                                    </IonLabel>                                                                                       
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>                                                    
                                                        <strong>House number:</strong> {currentParkingSpot.house_number}
                                                    </IonLabel>                                                    
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>
                                                        <strong>Zip:</strong> {currentParkingSpot.zip}
                                                    </IonLabel>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>
                                                        <strong>City:</strong> {currentParkingSpot.city}
                                                    </IonLabel>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>
                                                        <strong>Country:</strong> {currentParkingSpot.country}
                                                    </IonLabel>
                                                </IonCol>
                                            </IonRow>
                                        </IonCol>
                                        <IonRow>
                                            <IonCol className="ion-text-center">
                                                <IonButton onClick={() => setShowModalTwo(false)}>Schließen</IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonRow>
                                </IonGrid>
                                ): (
                                    <IonLabel>Laden...</IonLabel>
                                )}
                                </IonContent>
                                </IonModal>
                                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="custom-modal">
                                <IonContent>
                                {selectedInvoice ? (
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
                                                Zahlungsdatum: {selectedInvoice.payment_date}
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
                                    <IonRow>
                                        <IonCol className="ion-text-center">
                                            <IonButton onClick={() => setShowModal(false)}>Schließen</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                    ) : (
                                    <IonLabel>Laden...</IonLabel>
                                    )}
                                </IonContent>
                                </IonModal>
                            </IonList>
                            </div>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>

    );
}
export default OwnReservations;