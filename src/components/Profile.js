import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UserRegistryABI from '../abis/UserRegistry.json';

const Profile = ({ userInfo, ownedJewelryCount }) => {
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
    <div className='pt-5 text-center'>
      <h1>Hi {userInfo ? userInfo.username : 'xy'}!</h1>
    
      {userInfo && (
        <div className='pt-5'>
            <p><b>address:</b> {userInfo ? userInfo.address : ''}</p>
            <p><b>name:</b> {userInfo ? userInfo.username : ''}</p>
            <p><b>Role:</b> {userInfo ? userInfo.role : ''}</p>
        </div>
      )}

      
      <p><b>Owned jewelry count:</b> {ownedJewelryCount}</p>

    </div>
  );
};

export default Profile;
