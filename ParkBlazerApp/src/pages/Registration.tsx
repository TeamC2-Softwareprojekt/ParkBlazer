import React, { useState, useEffect } from 'react';
import { IonText } from '@ionic/react';

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
        <IonText>Hallo</IonText>
    );
}
export default Registration;