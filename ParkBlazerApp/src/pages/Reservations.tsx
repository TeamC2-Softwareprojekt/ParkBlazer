import React, { useState, useEffect, useCallback } from "react";
import { IonAlert, IonIcon, IonPopover } from '@ionic/react';
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
    IonModal,
    IonList,
    IonContent,
    
} from "@ionic/react";
import axios from "axios";
import AuthService from "../utils/AuthService";
import "./Reservations.css";
import Navbar from "../components/navbar";
import { initParkingSpaces, parkingSpace, parkingspaces } from "../data/parkingSpaces";
import { format } from "date-fns";


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

    interface CombinedData {
    reservation: Reservation;
    parkingspot: parkingSpace;
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
    const [showPopoverInvoice, setShowPopoverInvoice] = useState<boolean>(false);
    const [showPopovernformation, setShowPopoverInformation] = useState<boolean>(false);
    const [showPopoverImage, setShowPopoverImage] = useState<boolean>(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [currentParkingSpot, setcurrentParkingspot] = useState<parkingSpace | null>(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [error, setError] = useState<string>("");
    
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                
                const reservationsResponse = await axios.get('https://server-y2mz.onrender.com/api/user_reservations', {
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`
                    }
                });
                
                await initParkingSpaces();
                const reservations: Reservation[] = reservationsResponse.data;
                const allparkingspaces: parkingSpace[] = parkingspaces;

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

    const combineData = (reservations: Reservation[], parkingspots: parkingSpace[]) => {
        const combined = reservations.map(reservation => {
            const parkingspot = parkingspots.find(spot => spot.private_parkingspot_id === reservation.private_parkingspot_id);
            if (!parkingspot) throw new Error("Parkingspot not found");
            return { reservation, parkingspot};
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
            setShowPopoverInvoice(true);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later!");
            }
        }
    };

    const openPopoverInformation = (spot: parkingSpace) => {
        setcurrentParkingspot(spot);
        setShowPopoverInformation(true);
    }
    const openPopoverImage = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setShowPopoverImage(true);
    };

    
    return(
        <>
        <Navbar/>
                <IonRow>
                    <IonCol size="10" size-sm="10" size-md="10">
                        <IonCard>
                            <IonCardContent>
                            <IonText color="primary">
                                <h1 className="reservation-heading">Reservierungen</h1>
                            </IonText>
                            <IonList>                               
                                {combinedData && combinedData.map((data, index)  => (
                                    <IonItem key={index}>
                                        <IonThumbnail slot="start" onClick={() => openPopoverImage(data.parkingspot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg")}>
                                            <img alt={`Thumbnail of ${data.parkingspot.name}`} src={data.parkingspot.image_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} />
                                        </IonThumbnail>
                                        <div className="data-row">
                                        <IonLabel onClick={() => window.open(`http://localhost:8100/parkingspot_details/${data.parkingspot.parkingspot_id}`, '_self')}style={{ flex: 1 }}>{data.parkingspot.name}</IonLabel>                                            
                                            <IonLabel className="label-margin"><strong>Status:</strong> {data.reservation.status}</IonLabel>
                                            <IonLabel className="label-margin"><strong>Start-Datum:</strong> {format(data.reservation.start_date, 'dd.MM.yyy hh:mm')} Uhr</IonLabel>
                                            <IonLabel className="label-margin"><strong>End-Datum:</strong> {format(data.reservation.end_date, 'dd.MM.yyy hh:mm')} Uhr</IonLabel>                                           
                                            <IonIcon
                                                icon={informationCircleOutline}
                                                onClick={() => openPopoverInformation(data.parkingspot)}
                                                className="icon-style" />                                            
                                            <IonIcon 
                                                icon={cardOutline} 
                                                onClick={() => fetchInvoiceDetails(data.reservation.reservation_id)} 
                                                className="icon-style" /> 
                                            {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
                                        </div>                                               
                                    </IonItem>
                                ))}
                            </IonList>
                                <IonPopover isOpen={showPopovernformation} onDidDismiss={() => setShowPopoverInformation(false)} className="custom-modal">                                
                                <IonContent>
                                {currentParkingSpot ? (
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonLabel>
                                                <h1>Informationen: {currentParkingSpot.name} </h1>
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
                                                        <strong>Straße:</strong> {currentParkingSpot.street}
                                                    </IonLabel>                                                                                       
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>                                                    
                                                        <strong>Hausnummer:</strong> {currentParkingSpot.house_number}
                                                    </IonLabel>                                                    
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>    
                                                <IonCol> 
                                                    <IonLabel>      
                                                        <strong>Preis pro Stunde:</strong> {currentParkingSpot.price_per_hour}
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
                                                        <strong>Stadt:</strong> {currentParkingSpot.city}
                                                    </IonLabel>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonLabel>
                                                        <strong>Land:</strong> {currentParkingSpot.country}
                                                    </IonLabel>
                                                </IonCol>
                                            </IonRow>
                                        </IonCol>
                                        <IonRow>
                                            <IonCol className="ion-text-center">
                                                <IonButton onClick={() => setShowPopoverInformation(false)}>Schließen</IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonRow>
                                </IonGrid>
                                ): (
                                    <IonLabel>Laden...</IonLabel>
                                )}
                                </IonContent>
                                </IonPopover>
                                <IonPopover isOpen={showPopoverInvoice} onDidDismiss={() => setShowPopoverInvoice(false)} className="custom-modal">
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
                                                Zahlungsdatum: {format(selectedInvoice.payment_date, 'dd.MM.yyy hh:mm')} Uhr
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
                                            <IonButton onClick={() => setShowPopoverInvoice(false)}>Schließen</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                    ) : (
                                    <IonLabel>Laden...</IonLabel>
                                    )}
                                </IonContent>
                                </IonPopover>
                                <IonPopover isOpen={showPopoverImage} onDidDismiss={() => setShowPopoverImage(false)}>
                                    <div className="image-style">
                                    <img src={selectedImage} alt="Selected" style={{ maxHeight: '90%', maxWidth: '90%' }} />
                                    </div>
                                    <IonButton onClick={() => setShowPopoverImage(false)} expand="full">Schließen</IonButton>
                                </IonPopover>
                            
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
        </>

    );
}
export default OwnReservations;