import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';
import GemSelecting from '../abis/GemstoneSelecting.json';
import Jewelry from '../abis/Jewelry.json';
import Navbar from './Navbar';
import GemDetails from './GemDetails';
import JewDetails from './JewDetails';
import Main from './Main';
import Dashboard from './Dashboard';
import MinedGemsList from './MinedGemList';
import MinedGemForm from './MinedGemForm';
import JewelryForm from './JewelryForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OwnedByUser from './OwnedByUser'
import GemSelectingForm from './GemSelectingForm';
import GemMarket from './GemMarket';
import JewMarket from './JewMarket';
import LoggedIn from './LoggedIn';
import Repair from './Repair';
import Profile from './Profile';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadBlockchainData2();
    await this.loadBlockchainData3();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.setState({ account: (await window.web3.eth.getAccounts())[0], isLoggedIn: true });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      this.setState({ account: (await window.web3.eth.getAccounts())[0], isLoggedIn: true });
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = GemstoneExtraction.networks[networkId];
    if (networkData) {
      const gemstroneExtraction = new web3.eth.Contract(GemstoneExtraction.abi, networkData.address);
      this.setState({ gemstroneExtraction });
      const minedGemCount = await gemstroneExtraction.methods.minedGemCount().call();
      this.setState({ minedGemCount });

      for (var i = 1; i <= minedGemCount; i++) {
        const minedGems = await gemstroneExtraction.methods.minedGems(i).call();
        this.setState({
          minedGems: [...this.state.minedGems, minedGems]
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert('Gemstone contract not deployed to detected network. - own error');
    }
  }

  async loadBlockchainData2() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = GemSelecting.networks[networkId];
    if (networkData) {
      const gemstroneSelecting = new web3.eth.Contract(GemSelecting.abi, networkData.address);
      this.setState({ gemstroneSelecting });
      const selectedGemCount = await gemstroneSelecting.methods.selectedGemCount().call();
      this.setState({ selectedGemCount });

      for (var i = 1; i <= selectedGemCount; i++) {
        const selectedGems = await gemstroneSelecting.methods.selectedGems(i).call();
        this.setState({
          selectedGems: [...this.state.selectedGems, selectedGems]
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert('Gemstone selecting contract not deployed to detected network. - own error');
    }
  }

  async loadBlockchainData3() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Jewelry.networks[networkId];
    if (networkData) {
      const makeJew = new web3.eth.Contract(Jewelry.abi, networkData.address);
      this.setState({ makeJew });
      const jewelryCount = await makeJew.methods.jewelryCount().call();
      this.setState({ jewelryCount });

      for (var i = 1; i <= jewelryCount; i++) {
        const jewelry = await makeJew.methods.jewelry(i).call();
        this.setState({
          jewelry: [...this.state.jewelry, jewelry]
        });
      }
      this.setState({ loading: false });
    } else {
      window.alert('Jewelry contract not deployed to detected network. - own error');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      minedGemCount: 0,
      minedGems: [],
      selectedGemCount: 0,
      selectedGems: [],
      loading: true,
      jewelry: [],
      isLoggedIn: false
    };

    this.gemMining = this.gemMining.bind(this);
    this.purchaseGem = this.purchaseGem.bind(this);
    this.processingGem = this.processingGem.bind(this);
    this.gemSelecting = this.gemSelecting.bind(this);
    this.markGemAsSelected = this.markGemAsSelected.bind(this);
    this.markGemAsUsed = this.markGemAsUsed.bind(this);
    this.polishGem = this.polishGem.bind(this);
    this.jewelryMaking = this.jewelryMaking.bind(this);
    this.buyJewelry = this.buyJewelry.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
  }

  async refreshPage() {
    window.location.reload(false);
  }

  gemMining(gemType, weight, size, price, miningLocation, miningYear, fileUrl, purchased) {
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.gemMining(
      gemType,
      weight,
      size,
      price,
      miningLocation,
      miningYear,
      fileUrl,
      purchased
    ).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.loadBlockchainData();
        this.loadBlockchainData2();
        this.loadBlockchainData3();
        this.setState({ loading: false });
      });
  }

  purchaseGem(id, price) {
    const gasLimit = 120000;
    const gasPrice = window.web3.utils.toWei('10000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.purchaseGem(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  processingGem(id, price) {
    const gasLimit = 120000;
    const gasPrice = window.web3.utils.toWei('10000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.processingGem(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }
  markGemAsSelected(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.markGemAsSelected(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in markGemAsSelected: ", error);
        this.setState({ loading: false });
      });
  }
  

  markGemAsUsed(id) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.markGemAsUsed(id).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in markas: ", error);
        this.setState({ loading: false });
      });
  }

  gemSelecting(minedGemId, size, carat, color, gemType, grinding, fileUrl, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });

    this.state.gemstroneSelecting.methods.gemSelecting(minedGemId, size, carat, color, gemType, grinding, fileUrl, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in gemSelecting: ", error);
        this.setState({ loading: false });
      });
  }

  polishGem(id) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.polishGem(id).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  jewelryMaking(name, gemId, metal, depth, height, width, sale, price, fileURL) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.makeJew.methods.jewelryMaking(name, gemId, metal, depth, height, width, sale, price, fileURL).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Hiba történt a jewelryMaking függvényben: ", error);
        this.setState({ loading: false });
      });
    }

    async buyJewelry(id, price) {
      const gasLimit = 100000;
      // const gasPrice = window.web3.utils.toWei('20', 'gwei'); // Opciók kipróbálása gas price nélkül
      this.setState({ loading: true });
      console.log('itt meg megvagyok 1');
      try {
        console.log('itt meg megvagyok 1.2');
        const receipt = await this.state.makeJew.methods.buyJewelry(id).send({ from: this.state.account, value: price, gasLimit: gasLimit });
        console.log('itt meg megvagyok 2');
        this.setState({ loading: false });
        console.log('itt meg megvagyok 3');
        this.loadBlockchainData3(); // Reload data to reflect the change
        console.log('itt meg megvagyok 4');
        console.log('Transaction receipt:', receipt);
        console.log('itt meg megvagyok 5');
      } catch (error) {
        console.log('itt meg megvagyok 6');
        console.error("Error in buyJewelry:", error);
        console.log('itt meg megvagyok 7');
        this.setState({ loading: false });
        console.log('itt meg megvagyok 8');
      }
    }
    
    
 
    refreshPage = () => {
      window.location.reload();
    }
  
    render() {
      return (
        <div className='col-12 wid'>
          <div className='pt-5'>
            <button onClick={() => this.refreshPage()}>Click to reload!</button>
          </div>
  
          <Router>
            {this.state.isLoggedIn && window.location.pathname !== "/" && window.location.pathname !== "/loggedin" /*&& window.location.pathname !== "/gemMarket"*/ && window.location.pathname !== "/jewMarket" && <Navbar account={this.state.account} />}
  
            <Routes>
              <Route path="/" element={
                !this.state.isLoggedIn ? (
                  <h1>Login with MetaMask!</h1>
                ) : (
                  <Dashboard />
                )
              } />
              <Route path="/loggedin" element={<LoggedIn account={this.state.account}/>} />
              <Route path="/repair" element={<Repair />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/addMinedGem" element={<MinedGemForm gemMining={this.gemMining} />} />
              <Route path="/gemMarket" element={<GemMarket minedGems={this.state.minedGems}
                selectedGems={this.state.selectedGems}
                jewelry={this.state.jewelry}
                gemMining={this.gemMining}
                gemSelecting={this.gemSelecting}
                purchaseGem={this.purchaseGem}
                processingGem={this.processingGem}
                markGemAsSelected={this.markGemAsSelected}
                markGemAsUsed={this.markGemAsUsed}
                account={this.state.account}
                sellGem={this.sellGem}
                polishGem={this.polishGem} />} />
              <Route path="/jewMarket" element={<JewMarket jewelry={this.state.jewelry}
                account={this.state.account}
                buyJewelry={(id, price) => this.buyJewelry(id, price)} />} />
              <Route path="/ownMinedGems" element={<OwnedByUser minedGems={this.state.minedGems}
                selectedGems={this.state.selectedGems}
                jewelry={this.state.jewelry}
                gemMining={this.gemMining}
                gemSelecting={this.gemSelecting}
                purchaseGem={this.purchaseGem}
                processingGem={this.processingGem}
                markGemAsSelected={this.markGemAsSelected}
                markGemAsUsed={this.markGemAsUsed}
                account={this.state.account}
                sellGem={this.sellGem}
                polishGem={this.polishGem} />} />
              <Route path="/gem-select/:id" element={<GemSelectingForm gemSelecting={this.gemSelecting} />} />
              <Route path="/gem-details/:id" element={<GemDetails selectedGems={this.state.selectedGems}
                minedGems={this.state.minedGems}
                gemSelecting={this.gemSelecting}
                account={this.state.account} />} />
              <Route path="/jew-details/:id" element={<JewDetails selectedGems={this.state.selectedGems}
                minedGems={this.state.minedGems}
                jewelry={this.state.jewelry}
                gemSelecting={this.gemSelecting}
                account={this.state.account} />} />
              <Route path="/jewelry-making/gem/:id" element={<JewelryForm jewelryMaking={this.jewelryMaking}
                markGemAsUsed={this.markGemAsUsed} />} />
            </Routes>
          </Router>
        </div>
      );
    }
  }
  

export default App;
