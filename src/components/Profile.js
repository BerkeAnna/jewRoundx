import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UserRegistryABI from '../abis/UserRegistry.json';

const Profile = ({ userInfo }) => {
  const [jewelryId, setJewelryId] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          const contractAddress = '0x0D2ade6C7c9f0FABafc72F865415AA2dcD996A0f'; 

          const contract = new ethers.Contract(contractAddress, UserRegistryABI, signer);
          const userInfo = await contract.getUserInfo(address);
          
          console.log('User Info:', userInfo);

          setUserData({
            address: userInfo[0],
            username: userInfo[1],
            role: userInfo[2]
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.log('MetaMask is not installed');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jew-details/${jewelryId}`);
  };

  console.log(userInfo)

  return (
    <div className='pt-5'>
    <h1>Profile page in process....</h1>
    <h1>Hi {userInfo ? userInfo.username : 'xy'}!</h1>
    <h2>TODO:</h2>
    <p>-metamaskból adatok</p>
    <p>address: {userInfo ? userInfo.address : ''}</p>
    <p>name: {userInfo ? userInfo.username : ''}</p>
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
