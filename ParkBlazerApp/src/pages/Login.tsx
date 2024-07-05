import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  IonInput,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonAlert,
  IonText,
  IonPage,
  IonContent
} from "@ionic/react";
import AuthService from "../utils/AuthService";
import "./Login.css";
import Navbar from "../components/navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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

  // Handle every password change
  const handlePasswordChange = (event: CustomEvent) => {
    setPassword(event.detail.value!);
  };

  // Handle the user login
  const handleLogin = async () => {
    setError("");
    try {
      await AuthService.login(email, password);
      window.open(`/home`, '_self')
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <IonGrid fixed className="login-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol size="12" size-sm="12" size-md="12">
              <div className="login-container">
                <IonText color="primary" className="login-title">
                  <h1 className="login-heading">Einloggen</h1>
                </IonText>
                <IonInput
                  className={`login-input ${isEmailTouched && !emailValid ? "ion-invalid" : ""}`}
                  id="email-input"
                  type="email"
                  fill="solid"
                  label="E-Mail"
                  labelPlacement="floating"
                  errorText={!emailValid ? "Keine valide Email! Bitte überprüfen sie ihre Eingabe, und versuchen Sie es erneut." : ""}
                  onIonInput={handleEmailChange}
                  value={email}
                />
                <IonInput
                  className="login-input"
                  id="password-input"
                  type="password"
                  fill="solid"
                  label="Passwort"
                  labelPlacement="floating"
                  onIonInput={handlePasswordChange}
                  value={password}
                />
                <IonButton
                  expand="block"
                  onClick={handleLogin}
                  id="login-submit"
                  disabled={!email || !password || !emailValid}
                >
                  Login
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

export default Login;
