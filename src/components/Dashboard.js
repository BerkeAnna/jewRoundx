import React from 'react';

import { Link } from 'react-router-dom';

const Dashboard = ({ account }) => {
  return (
    <div className='pt-5'>
      <h1>Navigation</h1>
      todo: kivenni innen a navbart <br/>
      <Link className='text-info' to="/ownMinedGems"><button>Log in - user</button></Link><br/>
      <Link to="/gemMarket" className='text-white'><button>Gem Market</button></Link><br/>
      <Link to="/jewMarket" className='text-white'><button>Jew Market</button></Link><br/>
      
    </div>
  );
};

export default Dashboard;