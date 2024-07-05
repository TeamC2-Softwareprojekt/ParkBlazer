import React, { useState, useEffect } from 'react';
import { IonButton, IonToolbar, IonTitle, IonHeader, IonAvatar, IonPopover, IonList, IonContent, IonItem, IonText } from '@ionic/react';
import AuthService from '../utils/AuthService';
import './navbar.css';
import axios from 'axios';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(AuthService.isLoggedIn());
    const [username, setUsername] = useState<string>(localStorage.getItem('username') || "");
    const [userPoints, setUserPoints] = useState<string>();

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false);
        localStorage.removeItem('username');
        window.open('/home', "_self");
    };

    const handleUserMenu = async () => {
        if (!username || !userPoints) {
            try {
                const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`
                    }
                });
                const fetchedUsername = response.data.userDetails[0].username;
                const fetchedUserPoints = response.data.userDetails[0].points;
                setUsername(fetchedUsername);
                setUserPoints(fetchedUserPoints);
                localStorage.setItem('username', fetchedUsername);
            } catch (error: any) {
                throw new Error(error?.response?.data?.message || "An unexpected error occurred. Please try again later!");
            }
        }
    };

    useEffect(() => {
        if (loggedIn && (!username || !userPoints)) {
            handleUserMenu();
        }
    }, [loggedIn]);

    return (
        <IonHeader color="light" className='navbar'>
            <IonToolbar color="light">
                <IonTitle id="navbar-title" onClick={() => window.open('/home', "_self")}>ParkBlazer</IonTitle>
                <IonButton
                    id="popover-button"
                    slot="end"
                    onClick={AuthService.isLoggedIn() ? handleUserMenu : undefined}
                >
                    <IonAvatar id='nav-avatar' aria-hidden="true">
                        <img alt="Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                </IonButton>
                <IonPopover trigger="popover-button">
                    <IonContent>
                        <IonList>
                            {AuthService.isLoggedIn() ? (
                                <>
                                    <IonItem id='user-name'>
                                        {username && (<IonText>Hallo, {username}</IonText>)}
                                    </IonItem>
                                    <IonItem id='points'>
                                        {userPoints && (<IonText>Dein Punktestand: {userPoints}</IonText>)}
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/user_profile`, '_self')}>
                                        Profil
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/user_parkingspots`, '_self')}>
                                        Deine Parkplätze
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/user_reports`, '_self')}>
                                        Deine Meldungen
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/user_reservations`, '_self')}>
                                        Buchungen
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={handleLogout}>
                                        Logout
                                    </IonItem>
                                </>
                            ) : (
                                <>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/login`, '_self')}>
                                        Login
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={() => window.open(`/registration`, '_self')}>
                                        Registrierung
                                    </IonItem>
                                </>
                            )}
                        </IonList>
                    </IonContent>
                </IonPopover>
            </IonToolbar>
        </IonHeader>
    );
}

export default Navbar;
