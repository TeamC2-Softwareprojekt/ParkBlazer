import React from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';
import './Home.css';
import ParkingSpaceList from '../components/parkingSpaceList';

function Home() {
  return(
    <div className="Home">
      <Navbar/>
      <Map/>
      <ParkingSpaceList/>
    </div>
  )
}

export default Home;