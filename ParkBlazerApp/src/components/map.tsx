import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import axios from 'axios';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import MarkerMenu from './MarkerMenu';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [zoom] = useState<number>(6);
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);

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

  // this function gets all parking spots from the server
  const getParkingSpots = async () => {
    try {
      const response = await axios.get('https://server-y2mz.onrender.com/api/get_parkingspots');
      setParkingSpots(response.data);
      displayParkingSpotsOnMap(response.data);
    } catch (error) {
      console.error('Error getting all Parkingspots', error);
    }
  };

  // This function displays the parking spots on the map
  const displayParkingSpotsOnMap = (parkingSpots: any[]) => {
    if (!map.current) return;
  
    parkingSpots.forEach((spot) => {
      const { longitude, latitude, type_car, type_bike, type_truk, name, description, available_spaces, image_url, street, house_number, zip, city, country, username } = spot;
  
      // Function to add a checkmark or cross icon based on availability 
      const getAvailabilityIcon = (available: number) => available === 1 ? '✔' : '✖';
  
      const popupContent = `
        <div>
          <h3>${name}</h3>
          <p>${description}</p>
          <p>Verfügbare Plätze: ${available_spaces}</p>
          <p>${image_url ? `<img src="${image_url}" alt="Parkplatzbild" style="max-width: 100px;">` : ''}</p>
          <p>Adresse: ${street} ${house_number}, ${zip} ${city}, ${country}</p>
          <p>Benutzer: ${username}</p>
          <p>Auto: ${getAvailabilityIcon(type_car)}</p>
          <p>Fahrrad: ${getAvailabilityIcon(type_bike)}</p>
          <p>Lastwagen: ${getAvailabilityIcon(type_truk)}</p>
        </div>
      `;
  
      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .setPopup(new maptilersdk.Popup().setHTML(popupContent))
        .addTo(map.current!);
    });
  };

  // This function gets the user's current location and displays it on the map
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (map.current) {
          map.current.setCenter([longitude, latitude]);
          new maptilersdk.Marker({ color: "#0000FF" }) // Blue marker for user's location
            .setLngLat([longitude, latitude])
            .setPopup(new maptilersdk.Popup().setHTML("<h3>Ihr Standort</h3>"))
            .addTo(map.current);
        }
      }, (error) => {
        console.error('Error getting user location', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div className="marker-container"> 
        <MarkerMenu/> 
      </div>
    </div>
  );
}
