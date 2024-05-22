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
    <div className='centered-content pt-5'>
      <h1>Hi guest!</h1>
      
      <a href="/loggedIn"><div className='dashboardButton'><button>Log in - user</button></div></a><br/>

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