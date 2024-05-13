import React, { useState, useEffect } from 'react';
import { IonInput, IonCol, IonGrid, IonRow, IonInputPasswordToggle, IonButton } from '@ionic/react';
import { cogSharp } from 'ionicons/icons';
import axios from 'axios';

function Login() {
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetch("https://server-y2mz.onrender.com/users")
          .then((res) => {
              if (!res.ok) {
                  throw new Error('Network response was not ok');
              }
              return res.json();
          })
          .then((data) => console.log(data))
          .catch((err) => console.log('Fetch error:', err));
    }, []);
    

    const validateEmail = (email: string) => {
        return email.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

    const validate = (ev: Event) => {
        const value = (ev.target as HTMLInputElement).value;

        setIsValid(undefined);

        if (value === '') return;

        validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
    };

    const markTouched = () => {
        setIsTouched(true);
    };


    const handleLogin = async () => {
        console.log(email, password);
        try {
            const response = await axios.post(`https://server-y2mz.onrender.com/login_user`, {
                email: email,
                password: password
            });
            console.log(response.data);
            // Hier können Sie die weitere Verarbeitung des erfolgreichen Antworten durchführen
        } catch (error) {
            console.error('An error occurred while logging in:', error);
            // Hier können Sie die weitere Verarbeitung des Fehlers durchführen, z.B. Benachrichtigungen anzeigen
        }
    };
    
    



    return (
        <IonGrid fixed={true}>
            <IonRow class="ion-justify-content-center">
                <IonCol size="12" size-sm="4">
                    <IonInput
                        className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                        type="email"
                        fill="solid"
                        label="Email"
                        labelPlacement="floating"
                        helperText="Enter a valid email"
                        errorText="Invalid email"
                        onIonChange={(event) => setEmail(event.detail.value!)}
                        onIonInput={(event) => validate(event)}
                        onIonBlur={() => markTouched()}
                    ></IonInput>
                    <IonInput
                        className={`${isValid && 'ion-valid'} ${isTouched && 'ion-touched'}`}
                        type="password"
                        fill="solid"
                        label="Password"
                        labelPlacement="floating"
                        helperText="Enter your password."
                        errorText="Invalid password"
                        value={password}
                        onIonChange={(event) => setPassword(event.detail.value!)}
                        onIonBlur={() => markTouched()}
                    ></IonInput>
                    <IonButton onClick={handleLogin}>Login</IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
}
export default Login;