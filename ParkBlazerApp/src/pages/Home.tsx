import React, { useState, useEffect } from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';
import './Home.css';
import ParkingSpaceList from '../components/parkingSpaceList';
import Filter from '../components/filter';
import { parkingSpace, initParkingSpaces, getNearestParkingSpaces, parkingspaces, getFilteredParkingSpaces } from '../data/parkingSpaces';

function Home() {
  const [listparkingSpaces, setParkingSpaces] = useState<parkingSpace[]>([]);

  useEffect(() => {
      const fetchParkingSpaces = async () => {
          await initParkingSpaces();
          setParkingSpaces(parkingspaces);
      }

      fetchParkingSpaces();
  }, []);

  function updateList(event: any) {
      if (parkingspaces == undefined || parkingspaces.length === 0) return;

      if (event == null) {
          parkingspaces.map(p => p.distance = undefined);
          setParkingSpaces(parkingspaces);
          return;
      }

      let temp = getNearestParkingSpaces(event.center, 50);
      temp.sort((a, b) => a.distance! - b.distance!);
      setParkingSpaces(temp);
  }

  function applyFilter(filterParams: any) {
      if (parkingspaces == undefined || parkingspaces.length === 0) return;
      setParkingSpaces(getFilteredParkingSpaces(filterParams));
  }

  return(
    <div className="Home">
      <Navbar/>
      <Map onUpdateList={updateList}/>
      <ParkingSpaceList list={listparkingSpaces}/>
      <Filter onFilterApply={applyFilter}/>
    </div>
  )
}

export default Home;