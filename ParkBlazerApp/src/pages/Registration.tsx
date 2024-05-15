import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonInput, IonCol, IonGrid, IonRow, IonButton, IonAlert, IonText } from '@ionic/react';
import axios from 'axios';

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
    const history = useHistory();  // useHistory Hook initialisieren

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
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