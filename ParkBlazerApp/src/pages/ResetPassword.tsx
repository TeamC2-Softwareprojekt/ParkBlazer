import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  IonInput,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonAlert,
  IonText
} from "@ionic/react";
import AuthService from "../AuthService";
import Navbar from "../components/navbar";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const history = useHistory();

  // Validate the email of the input
  const validateEmail = useCallback((email: string) => {
    return /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
  }, []);

  // Handle every email change
  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value!);
    setIsEmailTouched(true)

    if (!(validateEmail(event.detail.value!))) {
      setEmailValid(false)
    } else {
      setEmailValid(true)
    }
  };

  // Handle the password reset request
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");
    try {
      setSuccess("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
    <Navbar/>
    <IonGrid fixed className="login-grid">
      <IonRow className="ion-justify-content-center ion-align-items-center full-height">
        <IonCol size="12" size-sm="8" size-md="8">
          <div className="login-container">
            <IonText color="primary" className="login-title">
              <h1 className="login-heading">PASSWORT ZURÜCKSETZEN</h1>
            </IonText>
            <IonInput
              className={`login-input ${isEmailTouched && !emailValid ? "ion-invalid" : ""}`}
              type="email"
              fill="solid"
              label="Email"
              labelPlacement="floating"
              errorText={!emailValid ? "Keine valide Email!" : ""}
              onIonInput={handleEmailChange}
              value={email}
            />
            <IonButton
              expand="block"
              onClick={handleResetPassword}
              className="login-button"
              disabled={!email || !emailValid}
            >
              Passwort zurücksetzen
            </IonButton>
            {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
            {success && <IonAlert isOpen={!!success} message={success} buttons={["OK"]} />}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
    </>
  );
};

export default ResetPassword;
