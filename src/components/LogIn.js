import React, { useState } from 'react';
import Web3 from 'web3';
import { useNavigate, useLocation } from 'react-router-dom';
import UserRegistry from '../abis/UserRegistry.json'; // Az okosszerződés ABI-ja

const LogIn = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [jewelryId, setJewelryId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jew-details/${jewelryId}`);
  };

  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask!");
    }
    return provider;
  };

  const checkIfAccountExists = async (web3, userAddress) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    return await contract.methods.isUserRegistered(userAddress).call();
  };

  const getUsername = async (web3, userAddress) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    return await contract.methods.getUsername(userAddress).call();
  };

  const registerUser = async (web3, userAddress, username) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    await contract.methods.registerUser(username).send({ from: userAddress });
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        setAccountAddress(userAccounts[0]);
        const accountExists = await checkIfAccountExists(web3, userAccounts[0]);
        if (accountExists) {
          const username = await getUsername(web3, userAccounts[0]);
          setUsername(username);
        }
        setHasAccount(accountExists);
        setIsConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRegister = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        const web3 = new Web3(currentProvider);
        await registerUser(web3, accountAddress, username);
        setHasAccount(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDisconnect = async () => {
    setIsConnected(false);
    setAccountAddress('');
    setHasAccount(false);
  };

  return (
    <div className='centered-content pt-5'>
      <h1>Hi guest!</h1>
      <h1>Connect with metamask!</h1>
      <div>
        {!isConnected ? (
          <div className='dashboardButton'>
            <button type="submit" onClick={onConnect}>
              login
            </button>
          </div>
        ) : (
          <div>
            <p>Connected as: {accountAddress}</p>
            {!hasAccount ? (
              <div>
              <div className='dashboardButton'>
                <input 
                  type="text" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
                <button type="submit" onClick={onRegister}>
                  Register
                </button>
              </div>
              <div className='dashboardButton'>
                <button type="submit" onClick={onDisconnect}>
                  Logout
                </button>
              </div>
              </div>
            ) : (
              <div >
                <div className='dashboardButton'>
                <button  type="submit" onClick={() => navigate('/loggedIn', { state: { username: username, account: accountAddress } })}>
                  Dashboard
                </button>
                </div>
                <div className='dashboardButton'>
                <button type="submit" onClick={onDisconnect}>
                  Logout
                </button>
                </div>
              </div>
            )}
            <div className='pt-5'>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
