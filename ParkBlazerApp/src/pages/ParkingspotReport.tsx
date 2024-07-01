import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    InputChangeEventDetail,
    IonButton,
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
    IonText,
} from "@ionic/react";
import "./ParkingspotReport.css";
import Navbar from "../components/navbar";
import { parkingSpace, parkingspaces, initParkingSpaces } from '../data/parkingSpaces';
import { IonInputCustomEvent } from "@ionic/core";
import axios from "axios";
import AuthService from "../utils/AuthService";

const ParkingspotReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parkingspot, setParkingspot] = useState<parkingSpace | null>(null);
    const [reportType, setReportType] = useState<string>("");
    const [reportAvailability, setReportAvailability] = useState<number>(0);
    const [reportDescription, setReportDescription] = useState<string | null | undefined>("");
    const [currentAvailability, setCurrentAvailability] = useState<number>(0);
    const [descriptionValid, setDescriptionValid] = useState<boolean>(false);
    const [availabilityValid, setAvailabilityValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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

    const handleSelectChange = (event: CustomEvent) => {
        const value = event.detail.value;

        switch (value) {
            case 'select-availability':
                setReportType('Aktuelle Auslastung melden');
                setReportAvailability(1);
                break;
            case 'select-not-existing':
                setReportType('Parkplatz existiert nicht');
                setReportAvailability(2);
                break;
            case 'select-update':
                setReportType('Parkplatzdetails aktualisieren');
                setReportAvailability(2);
                break;
            case 'select-other':
                setReportType('Sonstiges');
                setReportAvailability(2);
                break;
            default:
                setReportAvailability(0);
        }

    }

    const handleSubmitReport = async () => {
        try {
            const token = AuthService.getToken();
            let response;

            if (reportAvailability === 1) {
                response = await axios.post(
                    'https://server-y2mz.onrender.com/api/insert_parking_availability_report',
                    {
                        "parkingspot_id": parkingspot?.parkingspot_id,
                        "available_spaces": currentAvailability
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                response = await axios.post(
                    'https://server-y2mz.onrender.com/api/insert_parking_report',
                    {
                        "parkingspot_id": parkingspot?.parkingspot_id,
                        "report_type": reportType,
                        "description": reportDescription
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            if (response.status === 200) {
                window.open(`/parkingspot_details/${parkingspot?.parkingspot_id}`, '_self');
            } else {
                setError("Ein Fehler ist aufgetreten. Bitte später erneut versuchen!");
            }
        } catch (error) {
            setError("Ein Fehler ist aufgetreten. Bitte später erneut versuchen!");
        }
    };


    function handleAvailabilityChange(event: IonInputCustomEvent<InputChangeEventDetail>): void {
        const value = event.detail.value;
        if (value && (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 80)) {
            setAvailabilityValid(true);
            setCurrentAvailability(Number(value));
        } else {
            setAvailabilityValid(false);
            setCurrentAvailability(0);
            event.target.value = '';
        }
    }

    function handleReportCommentChange(event: IonInputCustomEvent<InputChangeEventDetail>): void {
        const value = event.detail.value;
        if (value === "") {
            setDescriptionValid(false);
            setReportDescription("");
        } else {
            setDescriptionValid(true);
            setReportDescription(value);
        }
    }

    return (
        <IonPage>
            <Navbar />
            <IonContent className="parkingspotreport-content ion-padding">
                <IonGrid fixed className="profile-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                        <IonCol className="profile-col" size="12" size-sm="12" size-md="12">
                            <IonText color="primary" className="userparkingspots-title">
                                <h1 className="userparkingspots-heading">Melde einen Parkplatz</h1>
                            </IonText>
                            {parkingspot &&
                                <IonList>
                                    <IonItem>
                                        <IonSelect
                                            label="Grund der Anfrage"
                                            placeholder=""
                                            onIonChange={handleSelectChange}
                                        >
                                            <IonSelectOption value="select-availability">Aktuelle Auslastung melden</IonSelectOption>
                                            <IonSelectOption value="select-not-existing">Parkplatz existiert nicht</IonSelectOption>
                                            <IonSelectOption value="select-update">Parkplatzdetails aktualisieren</IonSelectOption>
                                            <IonSelectOption value="select-other">Sonstiges</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                    {reportAvailability === 1 && (
                                        <div className="current-availability">
                                            <IonInput
                                                type="number"
                                                fill="solid"
                                                label={`Aktuell freie Parkplätze (Gesamt: ${parkingspot.available_spaces})`}
                                                labelPlacement="floating"
                                                onIonChange={handleAvailabilityChange}
                                                min={0}
                                                max={parkingspot.available_spaces}
                                            />
                                            <IonButton
                                                expand="block"
                                                onClick={handleSubmitReport}
                                                className="submit-button"
                                                disabled={!availabilityValid}
                                            >
                                                Senden
                                            </IonButton>
                                        </div>
                                    )}
                                    {reportAvailability === 2 && (
                                        <div className="report-comment">
                                            <IonInput
                                                type="text"
                                                fill="solid"
                                                label="Kommentar"
                                                labelPlacement="floating"
                                                onIonChange={handleReportCommentChange}
                                            />
                                            <IonButton
                                                expand="block"
                                                onClick={handleSubmitReport}
                                                className="submit-button"
                                                disabled={!descriptionValid}
                                            >
                                                Senden
                                            </IonButton>
                                        </div>
                                    )}
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
