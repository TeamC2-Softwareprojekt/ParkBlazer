import React, { useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';

const Home: React.FC = () => {
  useEffect(() => {
    // MapTiler-Karte initialisieren
    maptilersdk.config.apiKey = 'K3LqtEaJcxyh4Nf6BEPT';
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element to render the map
      style: 'streets-v2',
      center: [8.9189, 52.2900], // Minden, Deutschland (Längengrad, Breitengrad)
      zoom: 9, // starting zoom
    });

    const marker = new maptilersdk.Marker()
    .setLngLat([8.9189, 52.2900])
    .addTo(map);

    return () => {
      // Aufräumen beim Komponentenabbau, z.B. Karte zerstören
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
  );
};

export default Home;
