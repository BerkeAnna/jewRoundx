import React, { useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import UserRegistry from '../abis/UserRegistry.json'; // Az okosszerződés ABI-ja

const LogIn = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

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
          <div>
            <button onClick={onConnect}>
              login
            </button>
          </div>
        ) : (
          <div>
            <p>Connected as: {accountAddress}</p>
            {!hasAccount ? (
              <div>
                <input 
                  type="text" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
                <button onClick={onRegister}>
                  Register
                </button>
                <button onClick={onDisconnect}>
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => navigate('/loggedIn', { state: { username: username, account: accountAddress } })}>
                  Dashboard
                </button>
                <button onClick={onDisconnect}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
