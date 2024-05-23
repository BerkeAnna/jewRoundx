import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoggedIn = ({ account }) => {
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
    <div className='centered-content pt-5'>
      <h1>Hi {account}!</h1>
      
      <a href="/ownMinedGems"><div className='dashboardButton'><button>My products</button></div></a><br/>
      <a href="/addMinedGem"><div className='dashboardButton'><button>Gem mining</button></div></a><br/>
      <a href="/gemMarket"><div className='dashboardButton'><button>Gem Market</button></div></a><br/>
      <a href="/jewMarket"><div className='dashboardButton'><button>Jew Market</button></div></a><br/>
      <a href="/repair"><div className='dashboardButton'><button>Repair</button></div></a><br/>
      <a href="/profile"><div className='dashboardButton'><button>Profile</button></div></a><br/>
      <a href='\'><div className='dashboardButton'><button>Log out</button></div></a><br/>

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
