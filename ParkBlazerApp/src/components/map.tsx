import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import axios from 'axios';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import MarkerMenu from './MarkerMenu';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [zoom] = useState<number>(14);
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [locationCheckInterval, setLocationCheckInterval] = useState<number | null>(null);
  const [markerIsSet, setMarkerIsSet] = useState<boolean>(false);

  maptilersdk.config.apiKey = 'K3LqtEaJcxyh4Nf6BEPT'; 

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [8.9167, 52.2833],
      zoom: zoom
    });
    getParkingSpots();
    getUserLocation();
  }, [zoom]);

  const getParkingSpots = async () => {
    try {
      const response = await axios.get('https://server-y2mz.onrender.com/api/get_parkingspots');
      setParkingSpots(response.data);
      displayParkingSpotsOnMap(response.data);
    } catch (error) {
      console.error('Error getting all Parkingspots', error);
    }
  };

  const displayParkingSpotsOnMap = (parkingSpots: any[]) => {
    if (!map.current) return;
  
    parkingSpots.forEach((spot) => {
      
      const getAvailabilityIcon = (available: number) => available === 1 ? '✔' : '✖';
  
      const popupContent = `
        <div>
          <h3>${spot.name}</h3>
          <p>${spot.description}</p>
          <p>Verfügbare Plätze: ${spot.available_spaces}</p>
          <p>${spot.image_url ? `<img src="${spot.image_url}" alt="Parkplatzbild" style="max-width: 100px;">` : ''}</p>
          <p>Adresse: ${spot.street} ${spot.house_number}, ${spot.zip} ${spot.city}, ${spot.country}</p>
          <p>Benutzer: ${spot.username}</p>
          <p>Auto: ${getAvailabilityIcon(spot.type_car)}</p>
          <p>Fahrrad: ${getAvailabilityIcon(spot.type_bike)}</p>
          <p>Lastwagen: ${getAvailabilityIcon(spot.type_truk)}</p>
        </div>
      `;
  
      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([parseFloat(spot.longitude), parseFloat(spot.latitude)])
        .setPopup(new maptilersdk.Popup().setHTML(popupContent))
        .addTo(map.current!);
    });
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

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className="marker-container"> 
        <MarkerMenu/> 
      </div>
    </div>
  );
}
