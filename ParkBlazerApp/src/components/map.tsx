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
import { getUserLocation } from '../data/userLocation';

let map: React.MutableRefObject<maptilersdk.Map | null>;

export default function Map({onUpdateList, onLocationMarkerUpdate}: any) {
  const mapContainer = useRef<HTMLDivElement>(null);
  map = useRef<maptilersdk.Map | null>(null);
  const [zoom] = useState<number>(14);
  const [mapController, setMapController] = useState<any>();
  const markUserLocationInterval = useRef<NodeJS.Timeout>();
  const locationMarker = useRef<maptilersdk.Marker>();

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
  };
  
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
        <MarkerMenu/> 
      </div>
    </div>
  );
}

export {map};