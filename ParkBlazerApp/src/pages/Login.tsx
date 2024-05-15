import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonInput, IonCol, IonGrid, IonRow, IonButton, IonAlert } from '@ionic/react';
import AuthService from '../AuthService';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();  // useHistory Hook initialisieren

    useEffect(() => {
        setError(''); 
    }, []);

    const handleLogin = async () => {    
        try {
            setError(''); 
            await AuthService.login(email, password);
            console.log("Logged in!")
            history.push('/home')

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <IonGrid fixed={true} className="login-grid">
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" size-sm="4">
                    <IonInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onIonChange={(event) => setEmail(event.detail.value!)}
                        className="login-input"
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onIonChange={(event) => setPassword(event.detail.value!)}
                        className="login-input"
                    ></IonInput>
                    <IonButton onClick={handleLogin}>Login</IonButton>
                    {error && <IonAlert isOpen={!!error} message={error} buttons={['OK']} />}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
}

export default Login;
