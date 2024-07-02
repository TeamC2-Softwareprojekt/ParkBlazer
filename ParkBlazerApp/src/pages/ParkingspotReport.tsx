import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    InputChangeEventDetail,
    IonButton,
    IonCol,
    IonContent,
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

enum ReportType {
    None = 0,
    Availability = 1,
    NotExisting = 2,
    Update = 3,
    Other = 4
}

const ParkingspotReport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parkingspot, setParkingspot] = useState<parkingSpace | null>(null);
    const [reportType, setReportType] = useState<ReportType>(ReportType.None);
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
                console.error("Parkingspot not found.");
            }
        };

        initParkingSpaces().then(fetchParkingspotDetails);
    }, [id]);

    const handleSelectChange = (event: CustomEvent) => {
        const value = event.detail.value;

        switch (value) {
            case 'select-availability':
                setReportType(ReportType.Availability);
                break;
            case 'select-not-existing':
                setReportType(ReportType.NotExisting);
                break;
            case 'select-update':
                setReportType(ReportType.Update);
                break;
            case 'select-other':
                setReportType(ReportType.Other);
                break;
            default:
                setReportType(ReportType.None);
                break;
        }
    }

    const handleSubmitReport = async () => {
        try {
            const token = AuthService.getToken();
            let response;

            if (reportType === ReportType.Availability) {
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
        if (!value) {
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
            <IonContent className="ion-padding">
                <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                    <IonCol className="profile-col" size="12" size-sm="12" size-md="12">
                        <IonText>
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
                                {reportType === ReportType.Availability && (
                                    <div>
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
                                {reportType !== ReportType.None && reportType !== ReportType.Availability && (
                                    <div>
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
            </IonContent>
        </IonPage>
    );
};

export default ParkingspotReport;
