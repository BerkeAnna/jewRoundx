import React, { Component } from 'react';
import '../../styles/Navbar.css';

class Navbar extends Component {
  render() {
    const { account, username } = this.props;
    return (
      <nav className="navbar navbar-custom fixed-top p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/loggedIn">
          JewRx
        </a>
        <ul className="navbar-nav px-3 justify-content-center flex-row">
          <li className="nav-item">
            <a href="/loggedIn" className="text-white">Home</a>
          </li>
        </ul>
        <ul className="navbar-nav px-3">
          <li className="nav-item ml-2">
            <a href="/ownMinedGems" className="text-acc">
              <span id="account">{account}</span><br />
              <span>{username}</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
