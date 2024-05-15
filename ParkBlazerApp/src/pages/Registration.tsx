import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonInput, IonCol, IonGrid, IonRow, IonButton, IonAlert, IonText } from '@ionic/react';
import axios from 'axios';
import './Registration.css';

const Registration: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordValid, setPasswordValid] = useState<boolean>(true);
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [birthdateValid, setBirthdateValid] = useState<boolean>(true);
    const [address, setAddress] = useState<string>('');
    const [addressValid, setAddressValid] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const history = useHistory();  // useHistory Hook initialisieren
   
    
    // Funktion zur Überprüfung einer E-Mail-Adresse
    function isValidEmail(checkEmail: string) {
        // Regulärer Ausdruck für eine einfache E-Mail-Adressvalidierung
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(checkEmail);
    }

    function isValidDate(dateString: string) {
        const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
        return dateRegex.test(dateString);
    }
    

    function isValidAddress(address: string) {
        const addressRegex = /^([^\d]+)\s+(\d+.*)$/;
        return addressRegex.test(address);
    }
    

    const handleRegister = async () => {
        setEmailValid(true);
        setPasswordValid(true);
        setBirthdateValid(true);
        setAddressValid(true);

        if (!isValidEmail(email)) {
            setEmailValid(false);
            setError('Ungültige E-Mail-Adresse.');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordValid(false)
            setError('Passwords do not match');
            return;
        }
        if (!isValidDate(birthdate)){
            setBirthdateValid(false)
            setError('Ungültiges Geburtsdatum')
            return;
        }
        if (!isValidAddress(address)){
            setAddressValid(false)
            setError('Ungültige Address.');
            return;
        }
         try {
      const response = await axios.post('https://server-y2mz.onrender.com/api/register_user', 
      {username,
      email,
      password,
      firstname,
      lastname,
      birthdate,
      address  });

      setSuccess(response.data.message)
      history.push('/login')

    } catch (error: any) {

      if (error.response && error.response.data && error.response.data.error) {

        setError(error.response.data.error);


      } else {

        setError('An error occurred while register in. Please try again later.');


      }
    }
    };

    return (
        <IonGrid fixed={true} className="registration-grid">
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" size-sm="4">
                    <IonInput
                        type="text"
                        placeholder="Username"
                        value={username}
                        onIonChange={(e) => setUsername(e.detail.value!)}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                        color={emailValid ? "primary" : "danger"}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                        color={passwordValid ? "primary" : "danger"}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                        color={passwordValid ? "primary" : "danger"}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onIonChange={(e) => setFirstname(e.detail.value!)}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onIonChange={(e) => setLastname(e.detail.value!)}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Birth Date"
                        value={birthdate}
                        onIonChange={(e) => setBirthdate(e.detail.value!)}
                        color={birthdateValid ? "primary" : "danger"}
                        className="registration-input"
                    ></IonInput>
                    <IonInput
                        type="text"
                        placeholder="Address"
                        value={address}
                        onIonChange={(e) => setAddress(e.detail.value!)}
                        color={addressValid ? "primary" : "danger"}
                        className="registration-input"
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