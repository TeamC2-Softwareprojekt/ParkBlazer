import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
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
    IonList
} from "@ionic/react";
import axios from "axios";
import "./Userprofile_2.css";
import AuthService from "../AuthService";

const UserProfile_2: React.FC = () => {
    const initialUserData = {
        username: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        birthdate: "",
        street: "",
        house_number: "",
        zip: "",
        city: "",
        country: ""
    };

    const [userData, setUserData] = useState(initialUserData);
    const [originalUserData, setOriginalUserData] = useState(initialUserData);
    const [editMode, setEditMode] = useState(false);
    const [passwordValid, setPasswordValid] = useState<boolean>(true);
    const [cityValid, setCityValid] = useState<boolean>(true);
    const [streetValid, setStreetValid] = useState<boolean>(true);
    const [zipValid, setZipValid] = useState<boolean>(true);
    const [houseNumberValid, setHouseNumberValid] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [parkingSpots, setParkingSpots] = useState<any[]>([]);

    const history = useHistory();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = AuthService.getToken();
            try {
                const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userDetails = response.data;
                setUserData(userDetails.userDetails[0]);
                setOriginalUserData(userDetails.userDetails[0]);
                fetchParkingSpots(userDetails.userDetails[0].username);
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

    const fetchParkingSpots = async (username: string) => {
        try {
            const response = await axios.post('https://server-y2mz.onrender.com/api/get_parkingspots_created_by_user', {
                username: username
            });
            
            setParkingSpots(response.data);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred while fetching parking spots. Please try again later!");
            }
        }
    };

    const validatePassword = useCallback((password: string) => {
        return password.length > 10;
    }, []);

    const validateCity = useCallback((city: string) => {
        return city.trim().length > 0;
    }, []);

    const validateStreet = useCallback((street: string) => {
        return street.trim().length > 0;
    }, []);

    const validateZip = useCallback((zip: string) => {
        return zip.trim().length > 0;
    }, []);

    const validateHouseNumber = useCallback((houseNumber: string) => {
        return houseNumber.trim().length > 0;
    }, []);

    const handleInputChange = (field: string) => (event: CustomEvent) => {
        const value = event.detail.value!;
        setUserData((prevState) => ({ ...prevState, [field]: value }));

        if (field === "password") {
            setPasswordValid(validatePassword(value));
        } else if (field === "city") {
            setCityValid(validateCity(value));
        } else if (field === "street") {
            setStreetValid(validateStreet(value));
        } else if (field === "zip") {
            setZipValid(validateZip(value));
        } else if (field === "house_number") {
            setHouseNumberValid(validateHouseNumber(value));
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setError("");
            const token = AuthService.getToken();
            const response = await axios.post('https://server-y2mz.onrender.com/api/update_user', userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setError(response.data.message);
            history.push("/profile");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later!");
            }
        }
    };
    

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (!editMode) {
            setOriginalUserData(userData);
        } else {
            setUserData(originalUserData);
        }
    };

    const resetUserData = () => {
        setUserData(originalUserData);
        setEditMode(false);
    };

    return (
        <IonGrid fixed className="profile-grid">
            <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                <IonCol className="profile-col" size="12" size-sm="8" size-md="8">
                    <div className="profile-container">
                        <IonText color="primary" className="profile-title">
                            <h1 className="profile-heading">User Profile</h1>
                        </IonText>
                        <IonInput
                            className="profile-input"
                            type="text"
                            fill="solid"
                            label="Username"
                            labelPlacement="floating"
                            value={userData.username}
                            disabled
                        />
                        <IonInput
                            className="profile-input"
                            type="text"
                            fill="solid"
                            label="First Name"
                            labelPlacement="floating"
                            value={userData.firstname}
                            disabled
                        />
                        <IonInput
                            className="profile-input"
                            type="text"
                            fill="solid"
                            label="Last Name"
                            labelPlacement="floating"
                            value={userData.lastname}
                            disabled
                        />
                        <IonInput
                            className={"profile-input"}
                            type="email"
                            fill="solid"
                            label="Email"
                            labelPlacement="floating"
                            value={userData.email}
                            disabled
                        />
                        <IonInput
                            className={`profile-input ${!passwordValid ? "ion-invalid" : ""}`}
                            type="password"
                            fill="solid"
                            label="Password"
                            labelPlacement="floating"
                            value={userData.password}
                            disabled={!editMode}
                            onIonInput={handleInputChange("password")}
                            errorText={!passwordValid ? "Password must be longer than 10 characters!" : ""}
                        />
                        <IonInput
                            className="profile-input"
                            type="text"
                            fill="solid"
                            label="Birth Date"
                            labelPlacement="floating"
                            value={userData.birthdate}
                            disabled
                        />
                        <IonInput
                            className={`profile-input ${!cityValid ? "ion-invalid" : ""}`}
                            type="text"
                            fill="solid"
                            label="City"
                            labelPlacement="floating"
                            value={userData.city}
                            disabled={!editMode}
                            onIonInput={handleInputChange("city")}
                            errorText={!cityValid ? "City is required!" : ""}
                        />
                        <IonInput
                            className={`profile-input ${!streetValid ? "ion-invalid" : ""}`}
                            type="text"
                            fill="solid"
                            label="Street"
                            labelPlacement="floating"
                            value={userData.street}
                            disabled={!editMode}
                            onIonInput={handleInputChange("street")}
                            errorText={!streetValid ? "Street is required!" : ""}
                        />
                        <IonInput
                            className={`profile-input ${!zipValid ? "ion-invalid" : ""}`}
                            type="text"
                            fill="solid"
                            label="Zip"
                            labelPlacement="floating"
                            value={userData.zip}
                            disabled={!editMode}
                            onIonInput={handleInputChange("zip")}
                            errorText={!zipValid ? "Zip code is required!" : ""}
                        />
                        <IonInput
                            className={`profile-input ${!houseNumberValid ? "ion-invalid" : ""}`}
                            type="text"
                            fill="solid"
                            label="House Number"
                            labelPlacement="floating"
                            value={userData.house_number}
                            disabled={!editMode}
                            onIonInput={handleInputChange("house_number")}
                            errorText={!houseNumberValid ? "House number is required!" : ""}
                        />
                         <IonSelect
                            aria-label="Country"
                            label="Select Country"
                            labelPlacement="floating"
                            fill="solid"
                            value={userData.country}
                            disabled={!editMode}
                            onIonChange={(e) => setUserData((prevState) => ({ ...prevState, country: e.detail.value! }))}
                        >
                            <IonSelectOption value="Germany">Germany</IonSelectOption>
                            <IonSelectOption value="Austria">Austria</IonSelectOption>
                            <IonSelectOption value="Netherlands">Netherlands</IonSelectOption>
                        </IonSelect>
                        <IonButton
                            expand="block"
                            onClick={toggleEditMode}
                            className="profile-button"
                        >
                            {editMode ? "Cancel" : "Edit Profile"}
                        </IonButton>
                        {editMode && (
                            <IonButton
                                expand="block"
                                onClick={handleUpdateProfile}
                                className="profile-button"
                                disabled={!passwordValid || !cityValid || !streetValid || !zipValid || !houseNumberValid}
                            >
                                Save Changes
                            </IonButton>
                        )}
                        {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
                    </div>
                </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                <IonCol className="profile-col" size="12" size-sm="8" size-md="8">
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Deine angelegten Parkplätze</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonList>
                                {parkingSpots && parkingSpots.map((spot, index) => (
                                    <IonItem key={index}>
                                        <IonThumbnail slot="start">
                                            <img alt={`Thumbnail of ${spot.name}`} src={spot.thumbnailUrl || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} />
                                        </IonThumbnail>
                                        <IonLabel>{spot.name}</IonLabel>
                                        <IonLabel>{spot.description}</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default UserProfile_2;

