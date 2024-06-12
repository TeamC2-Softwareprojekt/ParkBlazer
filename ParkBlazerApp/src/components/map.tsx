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
import { initParkingSpaces, parkingspaces } from '../data/parkingSpaces';

let map: React.MutableRefObject<maptilersdk.Map | null>;

export default function Map({onUpdateList}: {onUpdateList: any}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  map = useRef<maptilersdk.Map | null>(null);
  const [zoom] = useState<number>(14);
  const [mapController, setMapController] = useState<any>();
  const [locationCheckInterval, setLocationCheckInterval] = useState<number | null>(null);
  const [markerIsSet, setMarkerIsSet] = useState<boolean>(false);
  const [selectingLocation, setSelectingLocation] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

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
    getUserLocation();
    fetchParkingSpaces();

    map.current.on('click', (e) => {
      console.log('Klick-Koordinaten:');
      if (selectingLocation) { 
        const coords = e.lngLat;
        setLatitude(coords.lat.toString());
        setLongitude(coords.lng.toString());
        setSelectingLocation(false); 
      }
      console.log('Klick-Koordinaten: ' + e.lngLat.toString());
    });
  }, []);

  useEffect(() => {
    if (markerIsSet && locationCheckInterval !== null) {
      clearInterval(locationCheckInterval);
      setLocationCheckInterval(null);
    } else if (locationCheckInterval === null) {
      const intervalId = window.setInterval(() => {
        getUserLocation();
      }, 10000); // 10 seconds
      setLocationCheckInterval(intervalId);
    }

    return () => {
      if (locationCheckInterval !== null) {
        clearInterval(locationCheckInterval);
      }
    };
  }, [markerIsSet]);

  function handleSearch(event: any) {
    onUpdateList(event);
  }
  
  const displayParkingSpotsOnMap = () => {
    if (!map.current) return;

    parkingspaces?.forEach((spot) => {
      const getAvailabilityIcon = (available: number) => available === 1 ? '✔' : '✖';

      const popupContent = `
        <div style="color: black">
          <h3>${spot.name}</h3>
          <p>${spot.description}</p>
          <p>Verfügbare Plätze: ${spot.available_spaces}</p>
          <p>${spot.image_url ? `<img src="${spot.image_url}" alt="Parkplatzbild" style="max-width: 100px;">` : ''}</p>
          <p>Adresse: ${spot.street} ${spot.house_number}, ${spot.zip} ${spot.city}, ${spot.country}</p>
          <p>Benutzer: ${spot.username}</p>
          <p>Auto: ${getAvailabilityIcon(spot.type_car)}</p>
          <p>Fahrrad: ${getAvailabilityIcon(spot.type_bike)}</p>
          <p>Lastwagen: ${getAvailabilityIcon(spot.type_truck)}</p>
        </div>
      `;

      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([spot.longitude, spot.latitude])
        .setPopup(new maptilersdk.Popup().setHTML(popupContent))
        .addTo(map.current!);
    });
  };

  const handleSelectLocationOnMap = () => { // #TODO: Funktioniert nicht
    setSelectingLocation(true); // das wird nicht auseführt??
    console.log('Die SelectionLocation AUF DER MAP: '+selectingLocation);

  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (markerIsSet || accuracy > 200) {
        console.error('The accuracy of the location is too low.');
        return;
      }
      setMarkerIsSet(true);
      if (map.current) {
        new maptilersdk.Marker({ color: "#0000FF" })
          .setLngLat([longitude, latitude])
          .setPopup(new maptilersdk.Popup().setHTML("<h3>Ihr Standort</h3>"))
          .addTo(map.current);
      }
    }, (error) => {
      console.error('Error getting user location', error);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  };

  return (
    <div className="map-wrap">
      <div className="geocoding">
        <GeocodingControl apiKey={maptilersdk.config.apiKey} mapController={mapController} onPick={(e) => handleSearch(e)} />
      </div>
      <div ref={mapContainer} className="map" />
      <div className="marker-container"> 
      <MarkerMenu 
        updateLatitude={setLatitude} 
        updateLongitude={setLongitude} 
        setSelectingLocation={setSelectingLocation} 
        onSelectLocationOnMap={handleSelectLocationOnMap}
      />
      </div>
    </div>
  );
}

export {map};
