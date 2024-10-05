import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UserRegistryABI from '../../abis/UserRegistry.json';
import '../../styles/Details.css';

const Profile = ({ userInfo, ownedJewelryCount, cuttedGemCount, ownedMinedGemCount, ownedMadeJewelryCount }) => {
  const [jewelryId, setJewelryId] = useState('');
  const navigate = useNavigate();
  console.log("u" + userInfo)
  const username = localStorage.getItem('username') || '';
  const role = localStorage.getItem('role') || '';

  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jewelry-details/${jewelryId}`);
  };

  return (
    <div className='pt-5 profile-card-container card-background ' style={{ textAlign: 'center' }}>
      <h1>Hi { username }!</h1>
     
      <div className="card profile-card" >
          <div>
            <p>Address: {username}</p>
            <p>Role: {role}</p>
          </div>
      </div>

      <div className="card profile-card">
        <h3>Gems summary data:</h3>
        <p>All the mined gem mined so far: {ownedMinedGemCount}</p>
        <p>Cutted Gem Count: {cuttedGemCount}</p>
        <p>Owned made jewelry: {ownedMadeJewelryCount}</p>
        <p>Currently owned jewelry: {ownedJewelryCount}</p>
      </div>
      <div className='homeButton'>
        <button onClick={() => navigate(`/loggedIn`)}>HOME PAGE</button>
      </div>
    
    </div>
  );
};

export default Profile;