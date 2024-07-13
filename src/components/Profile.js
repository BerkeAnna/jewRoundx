import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UserRegistryABI from '../abis/UserRegistry.json';

const Profile = ({ userInfo, ownedJewelryCount,/* selectedGemCount,*/ ownedMinedGemCount, ownedMadeJewelryCount }) => {
  const [jewelryId, setJewelryId] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jew-details/${jewelryId}`);
  };

  return (
    <div className='pt-5'>
      <h1>Profile page in process....</h1>
      <h1>Hi {userInfo ? userInfo.username : 'xy'}!</h1>
      <h2>TODO:</h2>
      <p>-metamaskból adatok</p>
      <p>address: {userInfo ? userInfo.address : ''}</p>
      <p>name: {userInfo ? userInfo.username : ''}</p>
      <p>Currently owned jewelry: {ownedJewelryCount}</p>
      <p>Owned made jewelry: {ownedMadeJewelryCount}</p>
     {/* <p>Selected Gem Count: {selectedGemCount}</p>*/}
      <p>All the mined gem mined so far: {ownedMinedGemCount}</p>
      <p>- név, miből mennyi van jelenleg</p>
      <p>- gomb a saját gems oldalra irányításhoz </p>
      {userInfo && (
        <div>
          <p>Address: {userInfo.address}</p>
          <p>Username: {userInfo.username}</p>
          <p>Role: {userInfo.role}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
