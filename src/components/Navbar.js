import React, { Component } from 'react';
import Web3 from 'web3'
import { Link } from 'react-router-dom';

class Navbar extends Component {

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand text-white col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Link to="/" className='text-white'>Mined gems</Link>
          
        </a>
        <ul className='navbar-nav px-3 justify-content-center d-flex flex-row'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <Link to="/addMinedGem" className='text-white'>Add mined gem</Link>
          </li>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <Link to="/addSelectedGem" className='text-white'>Add selected gem</Link>
          </li>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
          <Link to="/minedGems" className='text-white'>Mined Gems</Link>
          </li>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
           <Link to="/buyedGemsList" className='text-white'>Buyed Gems List</Link>
          </li>
        </ul>
        <ul className='navbar-nav px-3'>
        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
            <Link className='text-info' to="/ownMinedGems"><span id='account'>{this.props.account}</span></Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;