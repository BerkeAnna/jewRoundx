import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UserRegistryABI from '../abis/UserRegistry.json';

const Profile = ({ userInfo, ownedJewelryCount, cuttedGemCount, ownedMinedGemCount, ownedMadeJewelryCount }) => {
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
    <div className='pt-5' style={{ textAlign: 'center' }}>
      <h1>Hi {userInfo ? userInfo.username : 'xy'}!</h1>
     
      <div className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', // kékses árnyalatú háttér
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center', 
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' // shadow
      }}>
      <h3>Your data:</h3>
        {userInfo && (
          <div>
            <p>Address: {userInfo.address}</p>
            <p>Username: {userInfo.username}</p>
            <p>Role: {userInfo.role}</p>
          </div>
        )}
      </div>

      <div className="card" style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#FFF7F3', // kékses árnyalatú háttér
        width: '90%', 
        margin: 'auto', 
        textAlign: 'center', 
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', // shadow
        marginTop: '20px' // add this line to create 20px space between cards
      }}>
        <h3>Gems summary data:</h3>
        <p>All the mined gem mined so far: {ownedMinedGemCount}</p>
        <p>Cutted Gem Count: {cuttedGemCount}</p>
        <p>Owned made jewelry: {ownedMadeJewelryCount}</p>
        <p>Currently owned jewelry: {ownedJewelryCount}</p>
      </div>
     
    
    </div>
  );
};

export default Profile;
