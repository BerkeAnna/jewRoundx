import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importáld a useNavigate hookot


const Repair = ({ account }) => {
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
      <h1>Repair page in process....</h1>
     </div>
  );
};

export default Repair;