import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import UserRegistry from '../abis/UserRegistry.json';
import { sha3 } from 'web3-utils';

const LogIn = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Miner');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const getUserRole = async (web3, userAddress) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    return await contract.methods.getUserRole(userAddress).call();
  };

  const registerUser = async (web3, userAddress, username, role, passwordHash) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    await contract.methods.registerUser(username, role, passwordHash).send({ from: userAddress });
  };

  const authenticateUser = async (web3, userAddress, passwordHash) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserRegistry.networks[networkId];
    const contract = new web3.eth.Contract(UserRegistry.abi, deployedNetwork && deployedNetwork.address);
    return await contract.methods.authenticateUser(userAddress, passwordHash).call();
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
          const userRole = await getUserRole(web3, userAccounts[0]);
          setUsername(username);
          setRole(userRole);
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
        const passwordHash = sha3(password);
        await registerUser(web3, accountAddress, username, role, passwordHash);
        setHasAccount(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onAuthenticate = async () => {
    if (!enteredPassword) {
      setErrorMessage("Invalid password. Please try again.");
      return;
    }

    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        const web3 = new Web3(currentProvider);
        const passwordHash = sha3(enteredPassword);
        const isAuthenticated = await authenticateUser(web3, accountAddress, passwordHash);
        setIsAuthenticated(isAuthenticated);
        if (isAuthenticated) {
          // Store user data in localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('account', accountAddress);
          localStorage.setItem('role', role);
          navigate('/loggedIn', { state: { username: username, account: accountAddress, role: role } });
        } else {
          setErrorMessage("Invalid password. Please try again.");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDisconnect = async () => {
    setIsConnected(false);
    setAccountAddress('');
    setHasAccount(false);
    setUsername('');
    setRole('Miner');
    setPassword('');
    setEnteredPassword('');
    setIsAuthenticated(false);
    setErrorMessage('');
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('account');
    localStorage.removeItem('role');
  };

  return (
    <div className='centered-content pt-5'>
      <div>
        {!isConnected ? (
          <div>
            <h1>Hi!</h1>
            <h1>Connect with metamask!</h1>
            <div className='dashboardButton'>
              <button type="submit" onClick={onConnect}>
                login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Connected as: {accountAddress}</p>
            {hasAccount ? (
              <div>
                <p>Username: {username}</p>
                <p>Role: {role}</p>
                <div>
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={enteredPassword} 
                    onChange={(e) => setEnteredPassword(e.target.value)} 
                  />
                  
                </div>
                <div className='dashboardButton'>
                  <button type="submit" onClick={onAuthenticate}>
                    Dashboard
                  </button>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div className='dashboardButton'>
                  <button type="submit" onClick={onDisconnect}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                  </div>
                  <div>
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <div>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="Miner">Miner</option>
                      <option value="Gem cutter">Gem cutter</option>
                      <option value="Jeweler">Jeweler</option>
                    </select>
                  </div>
                  <div className='dashboardButton'>
                    <button type="submit" onClick={onRegister}>
                      Register
                    </button>
                  </div>
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
