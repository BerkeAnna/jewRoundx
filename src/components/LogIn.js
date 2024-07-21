import React, { useState, useRef, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { sha3 } from 'web3-utils';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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

  const usernameRef = useRef();
  const passwordRef = useRef();
  const ref = collection(firestore, "users");

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

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        setAccountAddress(userAccounts[0]);

        // Check if account exists in Firestore
        const q = query(ref, where("address", "==", userAccounts[0]));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUsername(userData.user);
          setRole(userData.role);
          setHasAccount(true);
        } else {
          setHasAccount(false);
        }

        setIsConnected(true);
      }
    } catch (err) {
      console.log("MetaMask connection error:", err);
      setErrorMessage("MetaMask connection error. Please try again.");
    }
  };

  const onRegister = async () => {
    try {
      const email = usernameRef.current.value;
      const password = passwordRef.current.value;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const passwordHash = sha3(password);
      const user = userCredential.user;

      const data = {
        user: email,
        password: passwordHash,
        address: accountAddress,
        role: role,
        uid: user.uid
      };

      await addDoc(ref, data);
      setHasAccount(true);
      console.log("User successfully added!");
    } catch (err) {
      console.log("Error adding user: ", err);
      setErrorMessage("Error adding user. Please try again.");
    }
  };

  const onAuthenticate = async () => {
    if (!enteredPassword) {
      setErrorMessage("Invalid password. Please try again.");
      return;
    }
  
    try {
      const email = username;
      const userCredential = await signInWithEmailAndPassword(auth, email, enteredPassword);
      const user = userCredential.user;
  
      // Generálj egy ID tokent a Firebase Authentication-től
      const token = await user.getIdToken();
  
      // Retrieve user data from Firestore
      const q = query(ref, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setIsAuthenticated(true);
  
        // Store user data and token in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('account', accountAddress);
        localStorage.setItem('role', role);
        localStorage.setItem('token', token);
  
        navigate('/loggedIn', { state: { username: username, account: accountAddress, role: role } });
      } else {
        setErrorMessage("User not found. Please register.");
      }
    } catch (err) {
      console.log("Authentication error:", err);
      setErrorMessage("Authentication error. Please try again.");
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Ellenőrizd a token érvényességét a szerveren (ha van ilyen végpontod)
        const response = await fetch('/api/validateToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      }
    };
  
    checkToken();
  }, []);
  

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
    localStorage.removeItem('token');
  };
  

  return (
    <div className='centered-content pt-5'>
      <div>
        {!isConnected ? (
          <div>
            <h1>Hi!</h1>
            <h1>Connect with MetaMask!</h1>
            <div className='dashboardButton'>
              <button type="submit" onClick={onConnect}>
                Login
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
                    placeholder="Enter email" 
                    ref={usernameRef} 
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    ref={passwordRef} 
                  />
                </div>
                <div>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Miner">Miner</option>
                    <option value="Gem Cutter">Gem Cutter</option>
                    <option value="Jeweler">Jeweler</option>
                  </select>
                </div>
                <div className='dashboardButton'>
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
