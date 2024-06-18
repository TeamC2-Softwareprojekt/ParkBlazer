import React, { useState, useEffect } from 'react';
import { IonButton, IonToolbar, IonTitle, IonButtons, IonHeader } from '@ionic/react';
import AuthService from '../AuthService';
import { useHistory } from 'react-router-dom';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(AuthService.isLoggedIn());
    const history = useHistory();  // useHistory Hook initialisieren

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false); // Aktualisiere den Zustand des eingeloggten Benutzers
        history.push('/home')
    };

    useEffect(() => {
        // Überwache Änderungen am eingeloggten Zustand und aktualisiere entsprechend
        setLoggedIn(AuthService.isLoggedIn());
    }, []);

    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle>ParkBlazer</IonTitle>
                <IonButtons slot="end">
                    {loggedIn ? (
                        <IonButton id="logout-button" onClick={handleLogout}>Logout</IonButton>
                    ) : (
                        <>
                        <IonButton id="login-button" routerLink="/login">Login</IonButton>
                        <IonButton id="registration-button" routerLink="/registration">Registration</IonButton>
                        </>
                        
                    )}
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
}

export default Navbar;
