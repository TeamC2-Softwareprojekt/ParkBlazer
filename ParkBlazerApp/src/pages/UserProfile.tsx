import React, { useState, useEffect, useCallback, Key, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import {
  IonInput,
  IonGrid,
  IonButton,
  IonAlert,
  IonText,
  IonSelect,
  IonSelectOption,
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import axios from "axios";
import "./UserProfile.css";
import AuthService from "../utils/AuthService";
import Navbar from "../components/navbar";

const UserProfile: React.FC = () => {
  const initialUserData = {
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthdate: "",
    street: "",
    house_number: "",
    zip: "",
    city: "",
    country: ""
  };

  const [userData, setUserData] = useState(initialUserData);
  const [originalUserData, setOriginalUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [cityValid, setCityValid] = useState<boolean>(true);
  const [streetValid, setStreetValid] = useState<boolean>(true);
  const [zipValid, setZipValid] = useState<boolean>(true);
  const [houseNumberValid, setHouseNumberValid] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [countries, setCountries] = useState<{
    value: Key | null | undefined;
    label: ReactNode; name: string
  }[]>([]);

  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://server-y2mz.onrender.com/api/get_user_details', {
          headers: {
            Authorization: `Bearer ${AuthService.getToken()}`
          }
        });
        const userDetails = response.data;
        setUserData(userDetails.userDetails[0]);
        setOriginalUserData(userDetails.userDetails[0]);
      } catch (error: any) {
        handleError(error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Cannont get countries!');
        }
        const data = await response.json();
        const countryOptions = data.map((country: any) => ({
          value: country.cca2,
          label: country.name.common
        }));

        const preferredCountries = ['DE', 'US', 'FR'].map(code =>
          countryOptions.find((country: { value: string; }) => country.value === code)
        ).filter(Boolean);

        const otherCountries = countryOptions.filter((country: any) => !preferredCountries.includes(country))
          .sort((a: { label: string; }, b: { label: any; }) => a.label.localeCompare(b.label));

        const sortedCountryOptions = [
          ...preferredCountries,
          ...otherCountries
        ];

        setCountries(sortedCountryOptions);
      } catch (error) {
        console.error('Error catching countries', error);
      }
    };

    fetchUserData();
    fetchCountries();
  }, []);

  const handleError = (error: any) => {
    if (error?.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("An unexpected error occurred. Please try again later!");
    }
  };

  const validatePassword = useCallback((password: string) => {
    return password.length > 10;
  }, []);

  const validateAddressDetail = useCallback((field: string) => {
    return field.trim().length > 0;
  }, []);

  const handleInputChange = (field: string) => (event: CustomEvent) => {
    const value = event.detail.value!;
    setUserData((prevState) => ({ ...prevState, [field]: value }));

    switch (field) {
      case 'password':
        setPasswordValid(validatePassword(value));
        break;
      case 'city':
        setCityValid(validateAddressDetail(value));
        break;
      case 'street':
        setStreetValid(validateAddressDetail(value));
        break;
      case 'zip':
        setZipValid(validateAddressDetail(value));
        break;
      case 'house_number':
        setHouseNumberValid(validateAddressDetail(value));
        break;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError("");
      const token = AuthService.getToken();
      const response = await axios.post('https://server-y2mz.onrender.com/api/update_user', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setError(response.data.message);
      history.push("/user_profile");
      window.location.reload();
    } catch (error: any) {
      handleError(error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setOriginalUserData(userData);
    } else {
      setUserData(originalUserData);
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent className="main-content">
        <IonGrid fixed className="profile-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center full-height">
            <IonCol className="profile-col" size="12" size-sm="8" size-md="8">
              <div className="profile-container">
                <IonText color="primary" className="profile-title">
                  <h1 className="profile-heading">Dein Nutzerprofil</h1>
                </IonText>
                <IonInput
                  className="profile-input"
                  type="text"
                  fill="solid"
                  label="Username"
                  labelPlacement="floating"
                  value={userData.username}
                  disabled
                />
                <IonInput
                  className="profile-input"
                  type="text"
                  fill="solid"
                  label="First Name"
                  labelPlacement="floating"
                  value={userData.firstname}
                  disabled
                />
                <IonInput
                  className="profile-input"
                  type="text"
                  fill="solid"
                  label="Last Name"
                  labelPlacement="floating"
                  value={userData.lastname}
                  disabled
                />
                <IonInput
                  className={"profile-input"}
                  type="email"
                  fill="solid"
                  label="Email"
                  labelPlacement="floating"
                  value={userData.email}
                  disabled
                />
                <IonInput
                  className={`profile-input ${!passwordValid ? "ion-invalid" : ""}`}
                  type="password"
                  fill="solid"
                  label="Password"
                  labelPlacement="floating"
                  value={userData.password}
                  disabled={!editMode}
                  onIonInput={handleInputChange("password")}
                  errorText={!passwordValid ? "Password must be longer than 10 characters!" : ""}
                />
                <IonInput
                  className="profile-input"
                  type="text"
                  fill="solid"
                  label="Birth Date"
                  labelPlacement="floating"
                  value={userData.birthdate}
                  disabled
                />
                <IonInput
                  className={`profile-input ${!cityValid ? "ion-invalid" : ""}`}
                  type="text"
                  fill="solid"
                  label="City"
                  labelPlacement="floating"
                  value={userData.city}
                  disabled={!editMode}
                  onIonInput={handleInputChange("city")}
                  errorText={!cityValid ? "City is required!" : ""}
                />
                <IonInput
                  className={`profile-input ${!streetValid ? "ion-invalid" : ""}`}
                  type="text"
                  fill="solid"
                  label="Street"
                  labelPlacement="floating"
                  value={userData.street}
                  disabled={!editMode}
                  onIonInput={handleInputChange("street")}
                  errorText={!streetValid ? "Street is required!" : ""}
                />
                <IonInput
                  className={`profile-input ${!zipValid ? "ion-invalid" : ""}`}
                  type="text"
                  fill="solid"
                  label="Zip"
                  labelPlacement="floating"
                  value={userData.zip}
                  disabled={!editMode}
                  onIonInput={handleInputChange("zip")}
                  errorText={!zipValid ? "Zip code is required!" : ""}
                />
                <IonInput
                  className={`profile-input ${!houseNumberValid ? "ion-invalid" : ""}`}
                  type="text"
                  fill="solid"
                  label="House Number"
                  labelPlacement="floating"
                  value={userData.house_number}
                  disabled={!editMode}
                  onIonInput={handleInputChange("house_number")}
                  errorText={!houseNumberValid ? "House number is required!" : ""}
                />
                <IonSelect
                  aria-label="Country"
                  label="Select Country"
                  labelPlacement="floating"
                  fill="solid"
                  value={userData.country}
                  disabled={!editMode}
                  onIonChange={(e) => setUserData((prevState) => ({ ...prevState, country: e.detail.value! }))}
                >
                  {countries.map(country => (
                    <IonSelectOption key={country.value} value={country.value}>
                      {country.label}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <IonButton
                  expand="block"
                  onClick={toggleEditMode}
                  className="profile-button"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </IonButton>
                {editMode && (
                  <IonButton
                    expand="block"
                    onClick={handleUpdateProfile}
                    className="profile-button"
                    disabled={!passwordValid || !cityValid || !streetValid || !zipValid || !houseNumberValid}
                  >
                    Save Changes
                  </IonButton>
                )}
                {error && <IonAlert isOpen={!!error} message={error} buttons={["OK"]} />}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;