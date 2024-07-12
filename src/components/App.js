import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';
import GemSelecting from '../abis/GemstoneSelecting.json';
import Jewelry from '../abis/Jewelry.json';
import UserRegistryABI from '../abis/UserRegistry.json'; // Importáld az ABI-t
import Navbar from './Navbar';
import Profile from './Profile';
import GemDetails from './GemDetails';
import JewDetails from './JewDetails';
import Main from './Main';
import Dashboard from './Dashboard';
import MinedGemsList from './MinedGemList';
import MinedGemForm from './MinedGemForm';
import JewelryForm from './JewelryForm';
import OwnedByUser from './OwnedByUser';
import GemSelectingForm from './GemSelectingForm';
import GemMarket from './GemMarket';
import JewMarket from './JewMarket';
import LoggedIn from './LoggedIn';
import Repair from './Repair';
import LogIn from './LogIn';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadBlockchainData2();
    await this.loadBlockchainData3();
    await this.loadBlockchainData4(); // Hívjuk meg a loadBlockchainData4 függvényt is
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
  
      let ownedJewelryCount = 0;
      for (var i = 1; i <= jewelryCount; i++) {
        const jewelry = await makeJew.methods.jewelry(i).call();
        if (jewelry.owner === accounts[0]) {
          ownedJewelryCount++;
        }
        this.setState({
          jewelry: [...this.state.jewelry, jewelry]
        });
      }
  
      this.setState({ ownedJewelryCount, loading: false });
    } else {
      window.alert('Jewelry contract not deployed to detected network. - own error');
    }
  }
  

  async loadBlockchainData4() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = UserRegistryABI.networks[networkId];
    if (networkData) {
      const userRegistry = new web3.eth.Contract(UserRegistryABI.abi, networkData.address);
      this.setState({ userRegistry });

      const userInfo = await userRegistry.methods.getUserInfo(accounts[0]).call();
      console.log('User Info:', userInfo);
      this.setState({
        userInfo: {
          address: userInfo[0],
          username: userInfo[1],
          role: userInfo[2]
        }
      });
      this.setState({ loading: false });
    } else {
      window.alert('UserRegistry contract not deployed to detected network.');
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
      jewelry: [],
      userInfo: null,
      ownedJewelryCount: 0, // Hozzáadva
      isLoggedIn: false,
      loading: true,
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
        this.loadBlockchainData4();
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
    this.setState({ loading: true });
    try {
      const receipt = await this.state.makeJew.methods.buyJewelry(id).send({ from: this.state.account, value: price, gasLimit: gasLimit });
      this.setState({ loading: false });
      this.loadBlockchainData3(); // Reload data to reflect the change
      console.log('Transaction receipt:', receipt);
    } catch (error) {
      console.error("Error in buyJewelry:", error);
      this.setState({ loading: false });
    }
  }

  refreshPage = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className='col-12 wid pt-5'>
        <Router>
          {this.state.isLoggedIn && window.location.pathname !== "/" && <Navbar account={this.state.account} />}

          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loggedin" element={<LoggedIn account={this.state.account} />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/profile" element={<Profile userInfo={this.state.userInfo} ownedJewelryCount={this.state.ownedJewelryCount } /*ide meg kellene adni a selectedGemCount={}*/ />} />

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
