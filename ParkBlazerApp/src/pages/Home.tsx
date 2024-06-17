import React, { useState, useEffect, useRef } from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';
import './Home.css';
import ParkingSpaceList from '../components/parkingSpaceList';
import Filter, { FilterParams, defaultFilterParams } from '../components/filter';
import { parkingSpace, initParkingSpaces, parkingspaces, getFilteredParkingSpaces, setDistancesToPoint } from '../data/parkingSpaces';
import { getUserLocation } from '../data/userLocation';

function Home() {
  const [parkingSpacesList, setParkingSpaces] = useState<parkingSpace[]>([]);
  const currentFilterParamsRef = useRef<FilterParams>(defaultFilterParams);
  let currentFilterParams: FilterParams = currentFilterParamsRef.current;

  useEffect(() => {
    const fetchParkingSpaces = async () => {
      await initParkingSpaces();
      setParkingSpaces(parkingspaces);
    }

    fetchParkingSpaces();
  }, []);

  function updateDistancesToUserLocation(filterParams: FilterParams = currentFilterParamsRef.current) {
    const userLocation = getUserLocation();
    if (!userLocation.latitude || !userLocation.longitude) return;

    setDistancesToPoint([userLocation.latitude, userLocation.longitude]);
    applyFilter(filterParams);
  }

  function updateList(event: any) {
    if (parkingspaces == undefined || parkingspaces.length === 0) return;

    if (!event) {
      currentFilterParams = { ...currentFilterParams, currentSearchCenter: [] };
      currentFilterParamsRef.current = currentFilterParams;
      updateDistancesToUserLocation(currentFilterParams);
      applyFilter(currentFilterParams);
      return;
    }

    currentFilterParams = { ...currentFilterParams, currentSearchCenter: [event.center[1], event.center[0]] };
    currentFilterParamsRef.current = currentFilterParams;
    applyFilter(currentFilterParams);
  }

  function applyFilter(filterParams: any) {
    if (parkingspaces == undefined || parkingspaces.length === 0) return;

    if (currentFilterParams.currentSearchCenter?.length)
      currentFilterParams = { ...filterParams, currentSearchCenter: currentFilterParamsRef.current.currentSearchCenter };
    else if (filterParams !== currentFilterParams)
      currentFilterParams = filterParams;

    currentFilterParamsRef.current = currentFilterParams;
    let filteredParkingSpaces = getFilteredParkingSpaces(currentFilterParams);

    if (filterParams.sort.by) {
      switch (filterParams.sort.by) {
        // TODO: implement sort by price
        case "distance":
          filteredParkingSpaces.sort((a, b) => a.distance! - b.distance!);
          break;
        case "availableSpaces":
          filteredParkingSpaces.sort((a, b) => a.available_spaces - b.available_spaces);
          break;
        default:
          break;
      }

      if (filterParams.sort.order === "desc") filteredParkingSpaces.reverse();
    }

    setParkingSpaces(filteredParkingSpaces);
  }

  return (
    <div className="Home">
      <Navbar />
      <Map onUpdateList={updateList} onLocationMarkerUpdate={updateDistancesToUserLocation} />
      <ParkingSpaceList list={parkingSpacesList} />
      <Filter onFilterApply={applyFilter} />
    </div>
  )
}

export default Home;