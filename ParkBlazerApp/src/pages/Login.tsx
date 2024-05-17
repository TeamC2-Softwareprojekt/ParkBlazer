import React, { useState, useEffect, useCallback } from "react";
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
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    setError("");
  }, []);

  const validateEmail = useCallback((email: string) => {
    return /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
  }, []);

  const handleEmailChange = (event: CustomEvent) => {
    const value = event.detail.value!;
    setEmail(value);
    setIsValid(value === "" ? undefined : validateEmail(value));
    setIsTouched(true);
  };

  const handlePasswordChange = (event: CustomEvent) => {
    setPassword(event.detail.value!);
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        setError("");
        await AuthService.login(email, password);
        console.log("Logged in!");
        history.push("/home");
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError("Both fields are required.");
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
              className={`login-input ${isValid ? "ion-valid" : ""} ${isValid === false ? "ion-invalid" : ""} ${isTouched ? "ion-touched" : ""}`}
              type="email"
              fill="solid"
              label="Email"
              labelPlacement="floating"
              errorText="Keine valide Email!"
              onIonChange={handleEmailChange}
              value={email}
            />
            <IonInput
              className="login-input"
              type="password"
              fill="solid"
              label="Password"
              labelPlacement="floating"
              onIonChange={handlePasswordChange}
              value={password}
            />
            <IonButton
              expand="block"
              onClick={handleLogin}
              className="login-button"
              disabled={!email || !password}
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
