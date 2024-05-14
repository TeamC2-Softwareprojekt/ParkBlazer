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
  const [parkingSpots, setParkingSpots] = useState<any[]>([]); // Parkplätze speichern in einem Array

  maptilersdk.config.apiKey = 'K3LqtEaJcxyh4Nf6BEPT'; // API Key setzen

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [8.9167, 52.2833],
      zoom: zoom
    });
    getParkingSpots();
  }, [zoom]);

  // Diese Funktion ruft die Parkplätze von der API ab und aktualisiert den State
  const getParkingSpots = async () => {
    try {
      const response = await axios.get('https://server-y2mz.onrender.com/api/parkingspots');
      setParkingSpots(response.data); // Parkplätze speichern
      displayParkingSpotsOnMap(response.data); // Parkplätze auf der Karte anzeigen
    } catch (error) {
      console.error('Error getting all Parkingspots', error);
    }
  };

  // Diese Funktion zeigt die Parkplätze auf der Karte an
  const displayParkingSpotsOnMap = (parkingSpots: any[]) => {
    if (!map.current) return; // prüft ob die Karte bereits geladen wurde

    // Marker für jeden Parkplatz hinzufügen
    parkingSpots.forEach((spot) => {
      const { longitude, latitude, name, description } = spot;

      // Marker zur Karte hinzufügen
      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([parseFloat(longitude), parseFloat(latitude)]) // Position setzen
        .setPopup(new maptilersdk.Popup().setHTML(`<h3>${name}</h3><p>${description}</p>`)) // Popup hinzufügen
        .addTo(map.current!);
    });
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
