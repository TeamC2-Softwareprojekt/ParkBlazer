import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import ReactCountriesInput from 'react-countries-input'
import {
    IonInput,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
    IonAlert
} from "@ionic/react";
//import "./Registration.css";
import axios from "axios";

const Registration: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [birthdate, setBirthdate] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
    const [isBirthdateValid, setIsBirthdateValid] = useState<boolean>(true);
    const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState<boolean>(false);
    const [isBirthdateTouched, setIsBirthdateTouched] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const history = useHistory();

    useEffect(() => {
        setError("");
    }, []);

    const validateEmail = useCallback((email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, []);

    const validatePassword = useCallback((password: string) => {
        return password.length > 10;
    }, []);

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

    useEffect(() => {
        setIsValid(
            isEmailValid &&
            isPasswordValid &&
            isBirthdateValid &&
            firstname.trim().length > 0 &&
            lastname.trim().length > 0 &&
            address.trim().length > 0
        );
    }, [isEmailValid, isPasswordValid, isBirthdateValid, firstname, lastname, address]);

    const handleEmailChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setEmail(value);
        setIsEmailTouched(true);
        setIsEmailValid(validateEmail(value));
    };

    const handlePasswordChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setPassword(value);
        setIsPasswordTouched(true);
        setIsPasswordValid(validatePassword(value));
    };

    const handleBirthdateChange = (event: CustomEvent) => {
        const value = event.detail.value!;
        setBirthdate(value);
        setIsBirthdateTouched(true);
        setIsBirthdateValid(validateBirthdate(value));
    };

    const handleRegister = async () => {
        if (isValid) {
            try {
                setError("");
                // Register logic here
                const response = await axios.post('https://server-y2mz.onrender.com/api/register_user', {
                    username,
                    email,
                    password,
                    firstname,
                    lastname,
                    birthdate,
                    address
                });
                console.log("Registered!");
                history.push("/login"); // Redirect to login after successful registration
            } catch (error: any) {
                setError("An error occurred while registering. Please try again later.");
            }
        } else {
            setError("Please fill out all fields correctly.");
        }
    };

    return (
        <IonGrid fixed className="register-grid">
            <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                <IonCol size="12" size-sm="8" size-md="8">
                    <div className="register-container">
                        <h1 className="register-heading">REGISTER</h1>
                        <IonInput
                            className={`register-input ${isEmailTouched && !isEmailValid ? "ion-invalid" : ""}`}
                            type="email"
                            fill="solid"
                            label="Email"
                            labelPlacement="floating"
                            value={email}
                            onIonChange={handleEmailChange}
                            errorText={isEmailTouched && !isEmailValid ? "Keine valide Email!" : ""}
                        />
                        <IonInput
                            className={`register-input ${isPasswordTouched && !isPasswordValid ? "ion-invalid" : ""}`}
                            type="password"
                            fill="solid"
                            label="Password"
                            labelPlacement="floating"
                            value={password}
                            onIonChange={handlePasswordChange}
                            errorText={isPasswordTouched && !isPasswordValid ? "Passwort muss länger als 10 Zeichen sein!" : ""}
                        />
                        <IonInput
                            className={`register-input ${isBirthdateTouched && !isBirthdateValid ? "ion-invalid" : ""}`}
                            type="date"
                            fill="solid"
                            label="Birth Date"
                            labelPlacement="floating"
                            value={birthdate}
                            onIonChange={handleBirthdateChange}
                            errorText={isBirthdateTouched && !isBirthdateValid ? "Keine 18 Jahre alt!" : ""}
                        />
                        <IonInput
                            className="register-input"
                            type="text"
                            fill="solid"
                            label="First Name"
                            labelPlacement="floating"
                            value={firstname}
                            onIonChange={(e) => setFirstname(e.detail.value!)}
                        />
                        <IonInput
                            className="register-input"
                            type="text"
                            fill="solid"
                            label="Last Name"
                            labelPlacement="floating"
                            value={lastname}
                            onIonChange={(e) => setLastname(e.detail.value!)}
                        />
                        <IonInput
                            className="register-input"
                            type="text"
                            fill="solid"
                            label="Address"
                            labelPlacement="floating"
                            value={address}
                            onIonChange={(e) => setAddress(e.detail.value!)}
                        />
                        <IonButton
                            expand="block"
                            onClick={handleRegister}
                            className="register-button"
                            disabled={!isValid}
                        >
                            Register
                        </IonButton>
                        {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
                    </div>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Registration;
