/*import React, { useState, useEffect } from 'react';
import { IonInput, IonCol, IonGrid, IonRow, IonButton, IonAlert } from '@ionic/react';
import { IonText } from '@ionic/react';
import AuthService from '../AuthService';

function Registration() {


// Daten, die du senden möchtest
const userData = {
    username: 'John Doe',
    email: 'john@example.com',
    password: 30,
    firstname: 21,
    lastname: 32,
    birthdate: 324,
    address: 424
};

// Anfrageoptionen konfigurieren
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // Wir geben an, dass wir JSON senden
    },
    body: JSON.stringify(userData) // Wir konvertieren die Daten in JSON
};

// Anfrage senden
fetch("https://server-y2mz.onrender.com/register_user", requestOptions)
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then((data) => console.log(data))
    .catch((err) => console.log('Fetch error:', err));


    return (
        <IonGrid fixed={true}>
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" size-sm="4">
                    <IonInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onIonChange={(event) => setEmail(event.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onIonChange={(event) => setPassword(event.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onIonChange={(event) => setConfirmPassword(event.detail.value!)}
                    ></IonInput>
                    <IonButton onClick={handleRegister}>Register</IonButton>
                    {error && <IonAlert isOpen={!!error} message={error} buttons={['OK']} />}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
}
export default Registration;
*/
import React, { useState } from 'react';
import { IonInput, IonCol, IonGrid, IonRow, IonButton, IonAlert, IonText } from '@ionic/react';

const Registration: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleRegister = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const userData = {
            username,
            email,
            password,
            firstname,
            lastname,
            birthdate,
            address
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };

        fetch("https://server-y2mz.onrender.com/register_user", requestOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setSuccess('Registration successful!');
                setError('');
            })
            .catch((err) => {
                setError('Registration failed. Please try again.');
                setSuccess('');
            });
    };

    return (
        <IonGrid fixed={true}>
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" size-sm="4">
                    <IonInput
                        type="text"
                        placeholder="Username"
                        value={username}
                        onIonChange={(e) => setUsername(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onIonChange={(e) => setFirstname(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onIonChange={(e) => setLastname(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Birth Date"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Address"
                        value={address}
                        onIonChange={(e) => setAddress(e.detail.value!)}
                    ></IonInput>
                    <IonButton onClick={handleRegister}>Register</IonButton>
                    {error && <IonAlert isOpen={!!error} message={error} buttons={['OK']} />}
                    {success && <IonAlert isOpen={!!success} message={success} buttons={['OK']} />}
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default Registration;