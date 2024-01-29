import React from 'react';

import { Link } from 'react-router-dom';

const Dashboard = ({ account }) => {
  return (
    <div className='pt-5'>
      <h1>Navigation</h1>
      todo: kivenni innen a navbart <br/>
      todo2: valamit tenni a lapok auto frissitéséért, most nem frissül alapból<br/>
      
      <a href="/ownMinedGems"><button>Log in - user</button></a><br/>
      <a href="/gemMarket"><button>Gem Market</button></a><br/>
      <a href="/jewMarket"><button>Jew Market</button></a><br/>
    </div>
  );
};

export default Dashboard;