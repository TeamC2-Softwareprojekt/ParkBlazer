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

      if (!filterParams.sort.by) return;

      let temp = [...listparkingSpaces];      
      switch (filterParams.sort.by) {
          // TODO: implement sort by price
          case "distance":
              temp.sort((a, b) => a.distance! - b.distance!);
              break;
          case "availableSpaces":
              temp.sort((a, b) => a.available_spaces - b.available_spaces);
              break;
          default:
              break;
      }
      
      if (filterParams.sort.order === "desc") temp.reverse();
      
      setParkingSpaces(temp);      
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