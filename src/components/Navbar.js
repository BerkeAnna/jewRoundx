import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';

class Navbar extends Component {


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            íasdsad
          </a>
          <a>
            {this.props.account}
          </a>
        </nav>
      
      </div>
    );
  }
}

export default Navbar;
