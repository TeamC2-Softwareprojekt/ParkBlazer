import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    IonCol,
    IonContent,
    IonGrid,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import "./ParkingspotDetails.css";
import Navbar from "../components/navbar";
import { parkingSpace, parkingspaces, initParkingSpaces } from '../data/parkingSpaces';

const ParkingspotReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parkingspot, setParkingspot] = useState<parkingSpace | null>(null);

    useEffect(() => {
        const fetchParkingspotDetails = () => {
            const parkingspotDetails = parkingspaces.find(ps => ps.parkingspot_id === parseInt(id));
            if (parkingspotDetails) {
                setParkingspot(parkingspotDetails);
            } else {
                console.log("Parkingspot not found.");
            }
        };

        initParkingSpaces().then(fetchParkingspotDetails);
    }, [id]);

    return (
        <IonPage>
            <Navbar />
            <IonContent className="parkingspotreport-content ion-padding">
                <IonGrid fixed className="profile-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                        <IonCol className="profile-col" size="12" size-sm="12" size-md="12">
                            {parkingspot &&
                                <IonList>
                                    <IonItem>
                                        <IonSelect label="Grund der Anfrage" placeholder="">
                                            <IonSelectOption value="Parkplatz existiert nicht">Parkplatz existiert nicht</IonSelectOption>
                                            <IonSelectOption value="Parkplatzdetails aktualisieren">Parkplatzdetails aktualisieren</IonSelectOption>
                                            <IonSelectOption value="Sonstiges">Sonstiges</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            }
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ParkingspotReport;
