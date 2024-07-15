import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoggedIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jewelryId, setJewelryId] = useState('');
  
  // Load user data from localStorage
  const username = localStorage.getItem('username') || '';
  const account = localStorage.getItem('account') || '0x0';
  const role = localStorage.getItem('role') || '';

  const handleChange = (e) => {
    setJewelryId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/jew-details/${jewelryId}`);
  };

  return (
    <div className='centered-content pt-5'>
      {username !== '' && <h1>Hi {username}!</h1>}
      <p>{role} this is the role</p>
      
      {role === 'Miner' && (
        <div>
          <a href="/ownMinedGems"><div className='dashboardButton'><button>My products</button></div></a><br/>
          <a href="/addMinedGem"><div className='dashboardButton'><button>Gem mining</button></div></a><br/>
          <a href="/profile"><div className='dashboardButton'><button>Profile</button></div></a><br/>
          <a href='\'><div className='dashboardButton'><button>Log out</button></div></a><br/>
        </div>
      )}
       {role === 'Gem cutter' && (
        <div>
          <a href="/ownMinedGems"><div className='dashboardButton'><button>My products</button></div></a><br/>
          <a href="/gemMarket"><div className='dashboardButton'><button>Gem Market</button></div></a><br/>
          <a href="/profile"><div className='dashboardButton'><button>Profile</button></div></a><br/>
          <a href='\'><div className='dashboardButton'><button>Log out</button></div></a><br/>
        </div>
      )}
       {role === 'Jeweler' && (
        <div>
          <a href="/ownMinedGems"><div className='dashboardButton'><button>My products</button></div></a><br/>
          <a href="/jewMarket"><div className='dashboardButton'><button>Jew Market</button></div></a><br/>
          <a href="/profile"><div className='dashboardButton'><button>Profile</button></div></a><br/>
          <a href='\'><div className='dashboardButton'><button>Log out</button></div></a><br/>
        </div>
      )}
      {role !== 'Miner' && role !== 'Jeweler' && role !== 'Gem cutter' &&  (
        <div>
          <a href="/ownMinedGems"><div className='dashboardButton'><button>My products</button></div></a><br/>
          <a href="/addMinedGem"><div className='dashboardButton'><button>Gem mining</button></div></a><br/>
          <a href="/gemMarket"><div className='dashboardButton'><button>Gem Market</button></div></a><br/>
          <a href="/jewMarket"><div className='dashboardButton'><button>Jew Market</button></div></a><br/>
          <a href="/repair"><div className='dashboardButton'><button>Repair</button></div></a><br/>
          <a href="/profile"><div className='dashboardButton'><button>Profile</button></div></a><br/>
          <a href='\'><div className='dashboardButton'><button>Log out</button></div></a><br/>
        </div>
      )}

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
  );
};

export default LoggedIn;
