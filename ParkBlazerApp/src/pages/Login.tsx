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
import "./Login.css";

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
      history.push("/home");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <IonGrid fixed className="login-grid">
      <IonRow className="ion-justify-content-center ion-align-items-center full-height">
        <IonCol size="12" size-sm="8" size-md="8">
          <div className="login-container">
            <IonText color="primary" className="login-title">
              <h1 className="login-heading">LOGIN</h1>
            </IonText>
            <IonInput
              className={`login-input ${isEmailTouched && !emailValid ? "ion-invalid" : ""}`}
              id="email-input"
              type="email"
              fill="solid"
              label="Email"
              labelPlacement="floating"
              errorText={!emailValid ? "Keine valide Email!" : ""}
              onIonInput={handleEmailChange}
              value={email}
            />
            <IonInput
              className="login-input"
              id="password-input"
              type="password"
              fill="solid"
              label="Password"
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
  );
};

export default Login;
