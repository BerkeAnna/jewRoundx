import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


const Dashboard = ({ account }) => {
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
      <h1>Hi!</h1>
      
      <a href="/loggedIn"><div className='dashboardButton'><button>Log in - user</button></div></a><br/>
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

export default Dashboard;