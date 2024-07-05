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
    IonContent,
    IonPage
} from "@ionic/react";
import "./Registration.css";
import axios from "axios";
import Navbar from "../components/navbar";

const Registration: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [birthdate, setBirthdate] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [zip, setZip] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<string>("");

    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [passwordValid, setpasswordValid] = useState<boolean>(true);
    const [birthdateValid, setBirthdateValid] = useState<boolean>(true);
    const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
    const [isBirthdateTouched, setIsBirthdateTouched] = useState<boolean>(false);

    const [error, setError] = useState<string>("");
    const history = useHistory();


    // Validate the email of the input
    const validateEmail = useCallback((email: string) => {
        return /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    }, []);

    // Validate the password of the input
    const validatePassword = useCallback((password: string) => {
        return password.length > 10;
    }, []);

    // Validate the birthdate of the input
    const validateBirthdate = useCallback((birthdate: string) => {
        const today = new Date();
        const inputDate = new Date(birthdate);
        let age = today.getFullYear() - inputDate.getFullYear();
        const monthDiff = today.getMonth() - inputDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
            age--;
        }
        return age >= 18;
    }, []);

    const handleEmailChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setEmail(value);
        setIsEmailTouched(true);
        setEmailValid(validateEmail(value));
    };

    const handlePasswordChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setPassword(value);
        setIsPasswordTouched(true);
        setpasswordValid(validatePassword(value));
    };

    const handleBirthdateChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setBirthdate(value);
        setIsBirthdateTouched(true);
        setBirthdateValid(validateBirthdate(value));
    };

    const handleRegister = async () => {
        try {
            setError("");
            // Register logic here
            const response = await axios.post('https://server-y2mz.onrender.com/api/register_user', {
                username: username,
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                birthdate: birthdate,
                street: street,
                house_number: houseNumber,
                zip: zip,
                city: city,
                country: country
            });
            setError(response.data.message)
            history.push("/login");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again later!");
            }
        }

    };

    return (
        <IonPage>
            <Navbar />
            <IonContent className="main-content">
                <IonGrid fixed className="register-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height" overflow-scroll="true">
                        <IonCol className="register-col" size="12" size-sm="12" size-md="12" overflow-scroll="true">
                            <div className="register-container" overflow-scroll="true">
                                <IonText color="primary" className="register-title">
                                    <h1 className="login-heading">REGISTER</h1>
                                </IonText>
                                <IonInput
                                    className={`register-input ${isEmailTouched && !emailValid ? "ion-invalid" : ""}`}
                                    id="username-input"
                                    type="text"
                                    fill="solid"
                                    label="Username"
                                    labelPlacement="floating"
                                    value={username}
                                    onIonInput={(e) => setUsername(e.detail.value!)}
                                />
                                <IonInput
                                    className="register-input"
                                    id="firstname-input"
                                    type="text"
                                    fill="solid"
                                    label="First Name"
                                    labelPlacement="floating"
                                    value={firstname}
                                    onIonInput={(e) => setFirstname(e.detail.value!)}
                                />
                                <IonInput
                                    className="register-input"
                                    id="lastname-input"
                                    type="text"
                                    fill="solid"
                                    label="Last Name"
                                    labelPlacement="floating"
                                    value={lastname}
                                    onIonInput={(e) => setLastname(e.detail.value!)}
                                />
                                <IonInput
                                    className={`register-input ${isEmailTouched && !emailValid ? "ion-invalid" : ""}`}
                                    id="email-input"
                                    type="email"
                                    fill="solid"
                                    label="Email"
                                    labelPlacement="floating"
                                    value={email}
                                    onIonInput={handleEmailChange}
                                    errorText={!emailValid ? "Keine valide Email!" : ""}
                                />
                                <IonInput
                                    className={`register-input ${isPasswordTouched && !passwordValid ? "ion-invalid" : ""}`}
                                    id="password-input"
                                    type="password"
                                    fill="solid"
                                    label="Password"
                                    labelPlacement="floating"
                                    value={password}
                                    onIonInput={handlePasswordChange}
                                    errorText={!passwordValid ? "Passwort muss länger als 10 Zeichen sein!" : ""}
                                />
                                <IonInput
                                    className={`register-input ${isBirthdateTouched && !birthdateValid ? "ion-invalid" : ""}`}
                                    id="birthdate-input"
                                    type="date"
                                    fill="solid"
                                    label="Birth Date"
                                    labelPlacement="floating"
                                    value={birthdate}
                                    onIonInput={handleBirthdateChange}
                                    errorText={!birthdateValid ? "Keine 18 Jahre alt!" : ""}
                                />
                                <IonInput
                                    className="register-input"
                                    id="street-input"
                                    type="text"
                                    fill="solid"
                                    label="Street"
                                    labelPlacement="floating"
                                    value={street}
                                    onIonInput={(e) => setStreet(e.detail.value!)}
                                />
                                <IonInput
                                    className="register-input"
                                    id="house-number-input"
                                    type="text"
                                    fill="solid"
                                    label="House Number"
                                    labelPlacement="floating"
                                    value={houseNumber}
                                    onIonInput={(e) => setHouseNumber(e.detail.value!)}
                                />
                                <IonInput
                                    className="register-input"
                                    id="zip-input"
                                    type="text"
                                    fill="solid"
                                    label="Zip"
                                    labelPlacement="floating"
                                    value={zip}
                                    onIonInput={(e) => setZip(e.detail.value!)}
                                />
                                <IonInput
                                    className="register-input"
                                    id="city-input"
                                    type="text"
                                    fill="solid"
                                    label="City"
                                    labelPlacement="floating"
                                    value={city}
                                    onIonInput={(e) => setCity(e.detail.value!)}
                                />
                                <IonSelect id="country-input" aria-label="Country" label="Select Country" labelPlacement="floating" fill="solid" onIonChange={(e) => setCountry(e.detail.value!)}>
                                    <IonSelectOption value="germany">Germany</IonSelectOption>
                                    <IonSelectOption value="austria">Austria</IonSelectOption>
                                    <IonSelectOption value="netherlands">Netherlands</IonSelectOption>
                                </IonSelect>
                                <IonButton
                                    expand="block"
                                    onClick={handleRegister}
                                    className="register-button"
                                    id="register-submit"
                                    disabled={!username || !firstname || !lastname || !email || !password || !birthdate || !street || !houseNumber || !zip || !city || !country || !emailValid || !passwordValid || !birthdateValid}
                                >
                                    Register
                                </IonButton>
                                {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Registration;
