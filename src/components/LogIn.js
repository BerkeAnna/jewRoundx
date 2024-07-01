import React, { useState } from 'react';
import Web3 from 'web3';

const LogIn = ({ account }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');

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
  }

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        const accountBalance = await web3.eth.getBalance(userAccounts[0]);
        setAccountAddress(userAccounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onDisconnect = async () => {
    setIsConnected(false);
    setAccountAddress('');
  }

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
            <button onClick={onDisconnect}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
