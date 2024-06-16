import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import UserProfile from './pages/UserProfile';
import ViewMessage from './pages/ViewMessage';
import Marker from './components/MarkerMenu'; // Import der Marker-Komponente
import ParkingspotDetails from './pages/ParkinspotDetails';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AuthService from './AuthService';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/message/:id">
          <ViewMessage />
        </Route>
        <Route path="/parkingspot_details/:id">
          <ParkingspotDetails />
        </Route>
        <Route path="/login">
          {AuthService.isLoggedIn() ? (
            <Redirect to="/home" />
          ) : (
            <Login />
          )}
        </Route>
        <Route path="/registration">
          {AuthService.isLoggedIn() ? (
            <Redirect to="/home" />
          ) : (
            <Registration />
          )}
        </Route>
        <Route path="/userprofile">
          {AuthService.isLoggedIn() ? (
            <UserProfile/>
          ) : (
            <Redirect to="/home" />
          )}
        </Route>
        <Route>
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
