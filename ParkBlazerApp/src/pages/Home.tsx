import React from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';
import './Home.css';

function Home() {
  return(
    <div className="Home">
      <Navbar/>
      <Map/>
    </div>
  )
}

export default Home;