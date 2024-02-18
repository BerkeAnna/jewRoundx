import React, { Component } from 'react';
import Web3 from 'web3';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-custom navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand text-white col-sm-3 col-md-2 mr-0" href="/">
          Mined gems
        </a>
        <ul className='navbar-nav px-3 justify-content-center d-flex flex-row'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <a href="/addMinedGem" className='text-white'>Add mined gem</a>
          </li>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
            <a href="/minedGems" className='text-white'>Mined Gems</a>
          </li>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
            <a href="/buyedGemsList" className='text-white'>Buyed Gems List</a>
          </li>
        </ul>
        <ul className='navbar-nav px-3'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
            <a href="/ownMinedGems" className='text-info'><span id='account'>{this.props.account}</span></a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
  