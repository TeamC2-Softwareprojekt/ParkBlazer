import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    IonButton,
    IonCard,
    IonCol,
    IonContent,
    IonGrid,
    IonInput,
    IonPage,
    IonRow,
    IonText,
    IonAlert
} from "@ionic/react";
import "./ParkingspotEdit.css";
import Navbar from "../components/navbar";
import { parkingspaces, initParkingSpaces, parkingSpace } from "../data/parkingSpaces";
import AuthService from "../utils/AuthService";
import axios from "axios";
import ImageUploader from "../components/ImageUploader";

const ParkingspotEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [parkingspot, setParkingspot] = useState<parkingSpace | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [availableSpaces, setAvailableSpaces] = useState<string>("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState<string>("");
    const [editMode, setEditMode] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        const fetchParkingspotDetails = async () => {
            await initParkingSpaces();
            const parkingspotDetails = parkingspaces.find(ps => ps.parkingspot_id === parseInt(id));
            if (parkingspotDetails) {
                setParkingspot(parkingspotDetails);
            } else {
                setError("Parkplatz nicht gefunden.");
            }
        };

        fetchParkingspotDetails();
    }, [id]);

    useEffect(() => {
        if (parkingspot) {
            setName(parkingspot.name);
            setDescription(parkingspot.description);
            setAvailableSpaces(parkingspot.available_spaces.toString());
            setImageUrl(parkingspot.image_url || "");
        }
    }, [parkingspot]);

    const handleUpdateParkingspot = async () => {
        try {
            setError("");
            const token = AuthService.getToken();
            const updatedParkingspot = {
                ...parkingspot,
                name,
                description,
                available_spaces: parseInt(availableSpaces),
                image_url: imageUrl ? imageUrl : "Empty"
            };
            const response = await axios.put(`https://server-y2mz.onrender.com/api/update_parkingspot/${parkingspot?.parkingspot_id}`, updatedParkingspot, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAlertMessage(response.data.message);
            setShowAlert(true);
        } catch (error: any) {
            setError(error.toString());
        }
    };

    const toggleEditMode = () => {
        if (editMode && parkingspot) {
            setName(parkingspot.name);
            setDescription(parkingspot.description);
            setAvailableSpaces(parkingspot.available_spaces.toString());
            setImageUrl(parkingspot.image_url || "");
        }
        setEditMode(!editMode);
    };

    const handleUploadComplete = (url: string) => {
        setImageUrl(url);
    };

    const handleAlertDismiss = () => {
        setShowAlert(false);
        window.open(`/parkingspot_details/${parkingspot?.parkingspot_id}`, '_self');
    };

    return (
        <IonPage>
            <Navbar />
            <IonContent className="parkingspotdetails-content ion-padding">
                <IonGrid fixed className="parkingspotdetails-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                        <IonCol className="parkingspotdetails-col" size="12">
                            <IonText color="primary" className="userparkingspots-title">
                                <h1 className="userparkingspots-heading">Bearbeite deinen Parkplatz</h1>
                            </IonText>
                            <IonCard>
                                <img alt="Parkplatz Bild" src={imageUrl} />
                                <div hidden={!editMode} id="upload-new-image">
                                    <ImageUploader onUploadComplete={handleUploadComplete} />
                                </div>
                                <IonInput
                                    className="parkingspot-input"
                                    type="text"
                                    fill="solid"
                                    label="Name"
                                    labelPlacement="floating"
                                    value={name}
                                    onIonChange={(e) => setName(e.detail.value!)}
                                    disabled={!editMode}
                                />
                                <IonInput
                                    className="parkingspot-input"
                                    type="text"
                                    fill="solid"
                                    label="Beschreibung"
                                    labelPlacement="floating"
                                    value={description}
                                    onIonChange={(e) => setDescription(e.detail.value!)}
                                    disabled={!editMode}
                                />
                                <IonInput
                                    className="parkingspot-input"
                                    type="number"
                                    fill="solid"
                                    label="Verfügbare Parkplätze"
                                    labelPlacement="floating"
                                    value={availableSpaces}
                                    onIonChange={(e) => setAvailableSpaces(e.detail.value!)}
                                    disabled={!editMode}
                                />
                                <IonButton
                                    expand="block"
                                    onClick={toggleEditMode}
                                    className="parkingspot-button"
                                >
                                    {editMode ? "Abbrechen" : "Parkplatz bearbeiten"}
                                </IonButton>
                                {editMode && (
                                    <IonButton
                                        expand="block"
                                        onClick={handleUpdateParkingspot}
                                        className="parkingspot-button"
                                    >
                                        Änderungen speichern
                                    </IonButton>
                                )}
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={handleAlertDismiss}
                    message={alertMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default ParkingspotEdit;
