import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    const { account, username } = this.props;
    return (
      <nav className="navbar navbar-custom navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand text-white col-sm-3 col-md-2 mr-0" href="/loggedIn">
          JewRx
        </a>
        <ul className='navbar-nav px-3 justify-content-center d-flex flex-row'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <a href="/loggedIn" className='text-white'>Home</a>
          </li>
        </ul>
        <ul className='navbar-nav px-3'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block ml-2'>
            <a href="/ownMinedGems" className='text-danger'>
              <span id='account'>{account}</span><br />
              <span>{username}</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
