import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';
import './Home.css';
import ParkingSpaceList from '../components/parkingSpaceList';
import Filter, { FilterParams, defaultFilterParams } from '../components/filter';
import { parkingSpace, initParkingSpaces, parkingspaces, getFilteredParkingSpaces, setDistancesToPoint } from '../data/parkingSpaces';
import { getUserLocation } from '../data/userLocation';
import { getAverageRatingOfParkingspot, getReviewsOfParkingspot, initReviews } from '../data/review';
import { MarkerMenu } from '../components/MarkerMenu'; // Import MarkerMenu

function Home() {
  const [parkingSpacesList, setParkingSpaces] = useState<parkingSpace[]>([]);
  const [isListVisible, setIsListVisible] = useState(true); // Zustand für die Sichtbarkeit der Liste
  const currentFilterParamsRef = useRef<FilterParams>(defaultFilterParams);
  let currentFilterParams: FilterParams = currentFilterParamsRef.current;

  useEffect(() => {
    const fetchData = async () => {
      await initParkingSpaces();
      await initReviews();
      setParkingSpaces(parkingspaces);
    }

    fetchData();
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
      updateDistancesToUserLocation(currentFilterParams);
    } else {
      currentFilterParams = { ...currentFilterParams, currentSearchCenter: [event.center[1], event.center[0]] };
    }

    currentFilterParamsRef.current = currentFilterParams;
    applyFilter(currentFilterParams);
  }

  const applyFilter = useCallback((filterParams: any) => {
    if (parkingspaces == undefined || parkingspaces.length === 0) return;

    if (currentFilterParams.currentSearchCenter?.length)
      currentFilterParams = { ...filterParams, currentSearchCenter: currentFilterParamsRef.current.currentSearchCenter };
    else if (filterParams !== currentFilterParams)
      currentFilterParams = filterParams;

    currentFilterParamsRef.current = currentFilterParams;
    let filteredParkingSpaces = getFilteredParkingSpaces(currentFilterParams);

    if (filterParams.sort.by) {
      const order = filterParams.sort.order === "desc" ? -1 : 1;
      switch (filterParams.sort.by) {
        case "price":
          const privateSpaces = filteredParkingSpaces.filter(p => p.price_per_hour);
          const publicSpaces = filteredParkingSpaces.filter(p => !p.price_per_hour);
          privateSpaces.sort((a, b) => (a.price_per_hour! - b.price_per_hour!) * order);
          filteredParkingSpaces = privateSpaces.concat(publicSpaces);
          break;
        case "distance":
          filteredParkingSpaces.sort((a, b) => (a.distance! - b.distance!) * order);
          break;
        case "availableSpaces":
          filteredParkingSpaces.sort((a, b) => (a.available_spaces - b.available_spaces) * order);
          break;
        case "rating":
          const ratedSpaces = filteredParkingSpaces.filter(p => getReviewsOfParkingspot(p.parkingspot_id).length);
          const unratedSpaces = filteredParkingSpaces.filter(p => !getReviewsOfParkingspot(p.parkingspot_id).length);
          ratedSpaces.sort((a, b) => (getAverageRatingOfParkingspot(a.parkingspot_id) - getAverageRatingOfParkingspot(b.parkingspot_id)) * order);
          filteredParkingSpaces = ratedSpaces.concat(unratedSpaces);
          break;
        default:
          break;
      }
    }

    setParkingSpaces(filteredParkingSpaces);
  }, []);

  const toggleList = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div className="Home">
      <Navbar />
      <Map onUpdateList={updateList} onLocationMarkerUpdate={updateDistancesToUserLocation} />
      {isListVisible && <ParkingSpaceList list={parkingSpacesList} />}
      <Filter onFilterApply={applyFilter} />
      <MarkerMenu toggleList={toggleList} /> 
    </div>
  );
}

export default Home;
