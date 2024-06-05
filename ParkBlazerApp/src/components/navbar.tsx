import React, { useState, useEffect } from 'react';
import { IonButton, IonToolbar, IonTitle, IonHeader, IonAvatar, IonPopover, IonList, IonContent, IonItem, IonText } from '@ionic/react';
import AuthService from '../AuthService';
import { useHistory } from 'react-router-dom';
import './navbar.css';
import axios from 'axios';

function Navbar() {
    const [loggedIn, setLoggedIn] = useState(AuthService.isLoggedIn());
    const [username, setUsername] = useState<string>("");
    const history = useHistory();

    const handleLogout = () => {
        AuthService.logout();
        setLoggedIn(false);
        history.push('/home');
    };

    const handleUserMenu = async () => {
        const token = AuthService.getToken();
        try {
            const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const userDetails = response.data;
            setUsername(userDetails.userDetails[0].username);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error("An unexpected error occurred. Please try again later!");
            }
        }
    };

    useEffect(() => {
        setLoggedIn(AuthService.isLoggedIn());
    }, []);

    return (
        <IonHeader color="light">
            <IonToolbar color="light">
                <IonTitle>ParkBlazer</IonTitle>

                <IonButton
                    id="popover-button"
                    slot="end"
                    onClick={loggedIn ? handleUserMenu : undefined}
                >
                    <IonAvatar id='nav-avatar' aria-hidden="true">
                        <img alt="Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                </IonButton>
                <IonPopover trigger="popover-button" dismissOnSelect={true}>
                    <IonContent>
                        <IonList>
                            {loggedIn ? (
                                <>
                                    <IonItem id='user-name'>
                                        {username && (<IonText>Hallo, {username}</IonText>)}
                                    </IonItem>
                                    <IonItem button={true} detail={false} routerLink="/userprofile2">
                                        Profil
                                    </IonItem>
                                    <IonItem button={true} detail={false} onClick={handleLogout}>
                                        Logout
                                    </IonItem>
                                </>
                            ) : (
                                <>
                                    <IonItem button={true} detail={false} routerLink="/login">
                                        Login
                                    </IonItem>
                                    <IonItem button={true} detail={false} routerLink="/registration">
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