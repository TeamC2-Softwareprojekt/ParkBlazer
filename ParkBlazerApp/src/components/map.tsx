import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null); // Hier Typangabe hinzugefügt
  const map = useRef<maptilersdk.Map | null>(null); // Hier Typangabe hinzugefügt
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const [zoom] = useState<number>(14); // Hier Typangabe hinzugefügt
  maptilersdk.config.apiKey = 'K3LqtEaJcxyh4Nf6BEPT';

  useEffect(() => {
    if (map.current) return; // Stoppt die Initialisierung der Karte mehr als einmal

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
