import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import maplibregl from 'maplibre-gl';
import "@maptiler/geocoding-control/style.css";
import 'maplibre-gl/dist/maplibre-gl.css';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

let map: React.MutableRefObject<maptilersdk.Map | null>;

export default function Map({onUpdateList}: {onUpdateList: any}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  map = useRef<maptilersdk.Map | null>(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const [zoom] = useState<number>(14);
  const [mapController, setMapController] = useState<any>();
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
    setMapController(createMapLibreGlMapController(map.current, maplibregl));
  }, [tokyo.lng, tokyo.lat, zoom]);


  function handleSearch(event: any) {
    onUpdateList(event);
  };

  return (
    <div className="map-wrap">
      <div className="geocoding">
        <GeocodingControl apiKey={maptilersdk.config.apiKey} mapController={mapController} onPick={(e) => handleSearch(e)} />
      </div>
        <div ref={mapContainer} className="map" />
    </div>
  );
}

export {map};