import React, { useState, useEffect } from 'react';
import { IonButton, IonToolbar, IonTitle, IonButtons, IonHeader } from '@ionic/react';
import AuthService from '../AuthService';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(AuthService.isLoggedIn());

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false); // Aktualisiere den Zustand des eingeloggten Benutzers
    };

    useEffect(() => {
        // Überwache Änderungen am eingeloggten Zustand und aktualisiere entsprechend
        setLoggedIn(AuthService.isLoggedIn());
    }, []);

    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle>Meine App</IonTitle>
                <IonButtons slot="end">
                    {loggedIn ? (
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    ) : (
                        <IonButton routerLink="/login">Login</IonButton>
                    )}
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
}

export default Navbar;
