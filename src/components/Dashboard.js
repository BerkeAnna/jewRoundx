import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importáld a useNavigate hookot


const Dashboard = ({ account }) => {
  const [jewelryId, setJewelryId] = useState(''); // Létrehozunk egy állapotot az ID tárolására
  const navigate = useNavigate(); // Hook használata az átirányításhoz

  // Kezeljük az ID beviteli mező változásait
  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  // Kezeljük a keresés gombra kattintást
  const handleSubmit = (e) => {
    e.preventDefault(); // Megakadályozzuk az alapértelmezett űrlap beküldési viselkedését
    navigate(`/jew-details/${jewelryId}`); // Átirányítjuk a felhasználót a megfelelő oldalra
  };

  return (
    <div className='pt-5'>
      <h1>Navigation</h1>
      todo: kivenni innen a navbart <br/>
      todo2: valamit tenni a lapok auto frissitéséért, most nem frissül alapból<br/>
      
      <a href="/ownMinedGems"><div className='dashboardButton'><button>Log in - user</button></div></a><br/>
      <a href="/gemMarket"><div className='dashboardButton'><button>Gem Market</button></div></a><br/>
      <a href="/jewMarket"><div className='dashboardButton'><button>Jew Market</button></div></a><br/>

      <h3>Search jewelry with ID</h3>
       <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={jewelryId} 
          onChange={handleChange} 
          placeholder="Enter Jewelry ID" 
        />
        <div className='dashboardButton'>
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;