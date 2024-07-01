import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import maplibregl from 'maplibre-gl';
import "@maptiler/geocoding-control/style.css";
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import MarkerMenu from './MarkerMenu';
import { initParkingSpaces, parkingSpace, parkingspaces } from '../data/parkingSpaces';
import { getUserLocation } from '../data/userLocation';
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonText, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonDatetime } from '@ionic/react';
import { checkmark, close, informationCircle } from 'ionicons/icons';

let map: React.MutableRefObject<maptilersdk.Map | null>;

export default function Map({ onUpdateList, onLocationMarkerUpdate }: any) {
  const mapContainer = useRef<HTMLDivElement>(null);
  map = useRef<maptilersdk.Map | null>(null);
  const [zoom] = useState<number>(14);
  const [mapController, setMapController] = useState<any>();
  const markUserLocationInterval = useRef<NodeJS.Timeout>();
  const locationMarker = useRef<maptilersdk.Marker>();
  const [selectedSpot, setSelectedSpot] = useState<parkingSpace | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isPrivateModal, setIsPrivateModal] = useState(false);

  maptilersdk.config.apiKey = 'K3LqtEaJcxyh4Nf6BEPT';

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [8.9167, 52.2833],
      zoom: zoom
    });

    window.onload = () => map.current?.resize();

    const fetchParkingSpaces = async () => {
      await initParkingSpaces();
      displayParkingSpotsOnMap();
    }

    setMapController(createMapLibreGlMapController(map.current, maplibregl));
    startLocationMarkerUpdate();
    fetchParkingSpaces();

    return () => stopLocationMarkerUpdate();
  }, []);

  function startLocationMarkerUpdate() {
    if (!markUserLocationInterval.current) markUserLocationInterval.current = setInterval(markUserLocation, 10000);
  }

  function stopLocationMarkerUpdate() {
    if (markUserLocationInterval.current) clearInterval(markUserLocationInterval.current);
  }

  function handleSearch(event: any) {
    if (event) stopLocationMarkerUpdate();
    else startLocationMarkerUpdate();
    onUpdateList(event);
  }

  const displayParkingSpotsOnMap = () => {
    if (!map.current) return;

    parkingspaces?.forEach((spot) => {
      const marker = new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        setSelectedSpot(spot);
        setIsPrivateModal(!!spot.price_per_hour);
        setShowModal(true);
      });
    });
  };

  const markUserLocation = () => {
    const location = getUserLocation();

    if (!location.latitude || !location.longitude || !map.current) return;

    if (locationMarker) locationMarker.current?.remove();

    locationMarker.current = new maptilersdk.Marker({ color: "#0000FF" });
    locationMarker.current?.setLngLat([location.longitude, location.latitude]);
    locationMarker.current?.setPopup(new maptilersdk.Popup().setHTML("<h3>Ihr Standort</h3>"));
    locationMarker.current?.addTo(map.current);
    onLocationMarkerUpdate();
  };

  return (
    <div className="map-wrap">
      <div className="geocoding">
        <GeocodingControl apiKey={maptilersdk.config.apiKey} mapController={mapController} onPick={(e) => handleSearch(e)} />
      </div>
      <div ref={mapContainer} className="map" />
      <div className="marker-container">
        <MarkerMenu />
      </div>

      {selectedSpot && (
        <IonModal className='modal_parkingspot_marker' isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedSpot.name}</IonTitle>
              <IonButton slot="end" onClick={() => window.open(`http://localhost:8100/parkingspot_details/${selectedSpot.parkingspot_id}`, '_self')}>
                <IonIcon icon={informationCircle} />
              </IonButton>
              <IonButton id="btn-close" slot="end" onClick={() => setShowModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonCard>
              {selectedSpot.image_url && <img src={selectedSpot.image_url} alt="Parkplatzbild" style={{ maxWidth: '100%' }} />}
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>{selectedSpot.description}</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
            <IonCard>
              <IonText><strong>Verfügbare Plätze:</strong> {selectedSpot.available_spaces}</IonText>
            </IonCard>
            <IonCard>
              <IonText><strong>Adresse:</strong> {selectedSpot.street} {selectedSpot.house_number}, {selectedSpot.zip} {selectedSpot.city}, {selectedSpot.country}</IonText>
            </IonCard>
            <IonCard>
              <IonText><strong>Angelegt von:</strong> {selectedSpot.username}</IonText>
            </IonCard>
            <IonCard>
              <IonText><strong>Auto:</strong> <IonIcon icon={selectedSpot.type_car ? checkmark : close} /></IonText>
              <br></br>
              <IonText><strong>Fahrrad:</strong> <IonIcon icon={selectedSpot.type_bike ? checkmark : close} /></IonText>
              <br></br>
              <IonText><strong>Lastwagen:</strong> <IonIcon icon={selectedSpot.type_truck ? checkmark : close} /></IonText>
            </IonCard>
            {isPrivateModal && (
              <>
                <IonCard>
                  <IonText><strong>Preis:</strong> {selectedSpot.price_per_hour} €</IonText>
                </IonCard>
                {selectedSpot.availability_start_date && selectedSpot.availability_end_date && (
                  <IonCard>
                  <IonText><strong>Verfügbarkeit:</strong></IonText>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <IonDatetime className="date-picker" value={selectedSpot?.availability_start_date} readonly={true} />
                  </div>
                </IonCard>
                )}
              </>
            )}
          </IonContent>
        </IonModal>
      )}
    </div>
  );
}

export { map };
