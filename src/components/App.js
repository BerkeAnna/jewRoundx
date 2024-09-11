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
import MinedGemMarket from './MinedGemMarket';
import GemMarket from './GemMarket';
import JewMarket from './JewMarket';
import JewProcessing from './JewProcessing';
import JewChangeGem from './JewChangeGem';
import LoggedIn from './LoggedIn';
import Repair from './Repair';
import LogIn from './LogIn';
import ProtectedRoute from '../ProtectedRoute'; // Helyes import útvonal

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.loadBlockchainData2();
    await this.loadBlockchainData3();
    //await this.loadBlockchainData4(); // Hívjuk meg a loadBlockchainData4 függvényt is
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ account: (await window.web3.eth.getAccounts())[0], isLoggedIn: true });
      } catch (error) {
        console.error("Error in loadWeb3: ", error);
        window.alert('Error in accessing MetaMask account.');
      }
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
    console.log('Network ID:', networkId);
    const networkData = GemstoneExtraction.networks[networkId];
    if (networkData) {
      const gemstroneExtraction = new web3.eth.Contract(GemstoneExtraction.abi, networkData.address);
      this.setState({ gemstroneExtraction });
      const minedGemCount = await gemstroneExtraction.methods.minedGemCount().call();
      this.setState({ minedGemCount });
  
      let ownedMinedGemCount = 0;
      for (var i = 1; i <= minedGemCount; i++) {
        const minedGems = await gemstroneExtraction.methods.minedGems(i).call();
        if (minedGems && minedGems.owner === accounts[0]) {
          ownedMinedGemCount++;
        }
        if (minedGems) {
          this.setState({
            minedGems: [...this.state.minedGems, minedGems]
          });
        }
      }
      
      this.setState({ ownedMinedGemCount, loading: false });
    } else {
      window.alert('Gemstone contract not deployed to detected network.');
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

      let cuttedGemCount = 0;

      for (var i = 1; i <= selectedGemCount; i++) {
        const selectedGem = await gemstroneSelecting.methods.getSelectedGem(i).call();
        if (selectedGem.owner === accounts[0]) {
          cuttedGemCount++;
        }
        this.setState({
          selectedGems: [...this.state.selectedGems, selectedGem]
        });
      }
      this.setState({ cuttedGemCount, loading: false });
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
      let ownedMadeJewelryCount = 0;
      for (var i = 1; i <= jewelryCount; i++) {
        const jewelry = await makeJew.methods.jewelry(i).call();
        if (jewelry.owner === accounts[0]) {
          ownedJewelryCount++;
        }
        if (jewelry.jeweler === accounts[0]) {
          ownedMadeJewelryCount++;
        }
        this.setState({
          jewelry: [...this.state.jewelry, jewelry]
        });
      }
  
      this.setState({ ownedJewelryCount, ownedMadeJewelryCount, loading: false });
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
  
      // Ellenőrizd, hogy a felhasználó regisztrálva van-e
      const isRegistered = await userRegistry.methods.isUserRegistered(accounts[0]).call();
      if (!isRegistered) {
        console.error('User is not registered');
        window.alert('User is not registered in the system');
        return;
      }
  
      // Ha regisztrálva van, kérjük le a felhasználói adatokat
      const userInfo = await userRegistry.methods.getUserInfo(accounts[0]).call();
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
      ownedMinedGemCount: 0,
      ownedMadeJewelry: 0,
      cuttedGemCount: 0,
      selectedGems: [],
      jewelry: [],
      userInfo: null,
      ownedJewelryCount: 0,
      isLoggedIn: false,
      loading: true,
      gemstroneExtraction: null, // Hozzáadva
      gemstroneSelecting: null, // Hozzáadva
      makeJew: null, // Hozzáadva
      userRegistry: null // Hozzáadva
    };
  
    this.gemMining = this.gemMining.bind(this);
    this.purchaseGem = this.purchaseGem.bind(this);
    this.processingGem = this.processingGem.bind(this);
    this.gemSelecting = this.gemSelecting.bind(this);
    this.markNewOwner = this.markNewOwner.bind(this);
    this.markGemAsUsed = this.markGemAsUsed.bind(this);
    this.markGemAsSelected = this.markGemAsSelected.bind(this);
    this.polishGem = this.polishGem.bind(this);
    this.jewelryMaking = this.jewelryMaking.bind(this);
    this.buyJewelry = this.buyJewelry.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.transferGemOwnership = this.transferGemOwnership.bind(this);
    this.updateGem = this.updateGem.bind(this);  // Bind the updateGem method
    this.markedAsFinished = this.markedAsFinished.bind(this);
    this.replaceGem = this.replaceGem.bind(this);

}

  

  async refreshPage() {
    window.location.reload(false);
  }

  gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased) {
    this.setState({ loading: true });
    if (this.state.gemstroneExtraction) {
      this.state.gemstroneExtraction.methods.gemMining(
        gemType,
        details,
        price,
        miningLocation,
        miningYear,
        fileUrl,
        purchased
      ).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          console.log('Receipt:', receipt);
          this.loadBlockchainData();
          this.loadBlockchainData2();
          this.loadBlockchainData3();
          this.loadBlockchainData4();
          this.setState({ loading: false });
        })
        .on('error', (error) => {
          console.error("Error in gemMining: ", error);
          this.setState({ loading: false });
        });
    } else {
      console.error("gemstroneExtraction is not defined");
      this.setState({ loading: false });
    }
  }
  


  purchaseGem(id, price) {
    const gasLimit = 120000;
    const gasPrice = window.web3.utils.toWei('10000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.purchaseGem(id).send({ from: this.state.account,/* value: price,*/ gasLimit: gasLimit, gasPrice: gasPrice })
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

  markNewOwner(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.markNewOwner(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in markNewOwner: ", error);
        this.setState({ loading: false });
      });
  }

  markGemAsSelected(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
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
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
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
  markedAsFinished(id) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.makeJew.methods.markedAsFinished(id).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
        .once('receipt', (receipt) => {
            this.setState({ loading: false });
        })
        .catch(error => {
            console.error("Error in mark as finished: ", error);
            this.setState({ loading: false });
        });
}



  gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });

    this.state.gemstroneSelecting.methods.gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price).send({ from: this.state.account })
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
  transferGemOwnership(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.transferGemOwnership(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in transferGemOwnership: ", error);
        this.setState({ loading: false });
      });
  }
  


  jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL) {  // physicalDetails, a combined metal and size
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.makeJew.methods.jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error occurred in jewelryMaking function: ", error);
        this.setState({ loading: false });
      });
  }

  

updateGem(jewelryId, newGemId) {
  const gasLimit = 90000;
  const gasPrice = window.web3.utils.toWei('8000', 'gwei');
  this.setState({ loading: true });

  this.state.makeJew.methods.updateGem(jewelryId, newGemId).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
      this.loadBlockchainData3(); // Reload data to reflect the change
    })
    .catch(error => {
      console.error("Error in updateGem: ", error);
      this.setState({ loading: false });
    });
}
replaceGem(jewelryId, oldGemId, newGemId) {
  const gasLimit = 90000;
  const gasPrice = window.web3.utils.toWei('7000', 'gwei');
  this.setState({ loading: true });

  this.state.makeJew.methods.replaceGem(jewelryId, oldGemId, newGemId).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
      this.loadBlockchainData2(); // Reload data to reflect the change
    })
    .catch(error => {
      console.error("Error in replaceGem: ", error);
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
            <Route path="/repair/:id" element={<ProtectedRoute><Repair selectedGems={this.state.selectedGems} updateGem={this.updateGem} markGemAsUsed={this.markGemAsUsed}  minedGems={this.state.minedGems}
                 jewelry={this.state.jewelry} 
                 jewelryContract={this.state.makeJew}
                 replaceGem={this.replaceGem}/></ProtectedRoute>} />
            <Route path="/" element={<LogIn />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/loggedin" element={<ProtectedRoute><LoggedIn account={this.state.account} /></ProtectedRoute>} />
            <Route path="/repair" element={<ProtectedRoute><Repair /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile userInfo={this.state.userInfo} ownedJewelryCount={this.state.ownedJewelryCount} cuttedGemCount={this.state.cuttedGemCount} ownedMinedGemCount={this.state.ownedMinedGemCount} ownedMadeJewelryCount={this.state.ownedMadeJewelryCount} /></ProtectedRoute>} />
            <Route path="/addMinedGem" element={<ProtectedRoute><MinedGemForm gemMining={this.gemMining} /></ProtectedRoute>} />
            <Route path="/minedGemMarket" element={
              <ProtectedRoute>
                <MinedGemMarket 
                  minedGems={this.state.minedGems}
                  selectedGems={this.state.selectedGems}
                  jewelry={this.state.jewelry}
                  gemMining={this.gemMining}
                  gemSelecting={this.gemSelecting}
                  purchaseGem={this.purchaseGem}
                  processingGem={this.processingGem}
                  markNewOwner={this.markNewOwner}
                  markGemAsUsed={this.markGemAsUsed}
                  account={this.state.account}
                  sellGem={this.sellGem}
                  polishGem={this.polishGem}
                />
              </ProtectedRoute>
            } />
            <Route path="/gemMarket" element={
              <ProtectedRoute>
                <GemMarket 
                  minedGems={this.state.minedGems}
                  selectedGems={this.state.selectedGems}
                  jewelry={this.state.jewelry}
                  gemMining={this.gemMining}
                  gemSelecting={this.gemSelecting}
                  purchaseGem={this.purchaseGem}
                  processingGem={this.processingGem}
                  markNewOwner={this.markNewOwner}
                  markGemAsUsed={this.markGemAsUsed}
                  account={this.state.account}
                  sellGem={this.sellGem}
                  polishGem={this.polishGem} 
                  transferGemOwnership={this.transferGemOwnership}
                />
              </ProtectedRoute>
            } />
            <Route path="/jewMarket" element={
              <ProtectedRoute>
                <JewMarket 
                  jewelry={this.state.jewelry}
                  account={this.state.account}
                  buyJewelry={(id, price) => this.buyJewelry(id, price)} 
                />
              </ProtectedRoute>
            } />
            <Route path="/ownMinedGems" element={
              <ProtectedRoute>
                <OwnedByUser 
                  minedGems={this.state.minedGems}
                  selectedGems={this.state.selectedGems}
                  jewelry={this.state.jewelry}
                  gemMining={this.gemMining}
                  gemSelecting={this.gemSelecting}
                  purchaseGem={this.purchaseGem}
                  processingGem={this.processingGem}
                  markGemAsSelected={this.markGemAsSelected}
                  markGemAsUsed={this.markGemAsUsed}
                  markedAsFinished={this.markedAsFinished}
                  account={this.state.account}
                  sellGem={this.sellGem}
                  polishGem={this.polishGem} 
                />
              </ProtectedRoute>
            } />
            <Route path="/gem-select/:id" element={<ProtectedRoute><GemSelectingForm gemSelecting={this.gemSelecting} /></ProtectedRoute>} />
            <Route path="/gem-details/:id" element={
              <ProtectedRoute>
                <GemDetails 
                  selectedGems={this.state.selectedGems}
                  minedGems={this.state.minedGems}
                  gemSelecting={this.gemSelecting}
                  account={this.state.account} 
                />
              </ProtectedRoute>
            } />
            <Route path="/jew-details/:id" element={
              <ProtectedRoute>
                <JewDetails 
                  selectedGems={this.state.selectedGems}
                  minedGems={this.state.minedGems}
                  jewelry={this.state.jewelry}
                  gemSelecting={this.gemSelecting}
                  account={this.state.account} 
                  jewelryContract={this.state.makeJew}
                  gemstoneSelectingContract={this.state.gemstroneSelecting}
                  gemstoneExtractionContract={this.state.gemstroneExtraction}
                />
              </ProtectedRoute>
            } />
             <Route path="/jew-processing/:id" element={
              <ProtectedRoute>
                <JewProcessing 
                 selectedGems={this.state.selectedGems} updateGem={this.updateGem} markGemAsUsed={this.markGemAsUsed}  minedGems={this.state.minedGems}
                 jewelry={this.state.jewelry} 
                 jewelryContract={this.state.makeJew}
                 
                />
              </ProtectedRoute>
            } />
             <Route path="/repair/:id/change-gem/:oldGemId" element={
              <ProtectedRoute>
               <JewChangeGem  
                  selectedGems={this.state.selectedGems} 
                  updateGem={this.updateGem} 
                  markGemAsUsed={this.markGemAsUsed}  
                  minedGems={this.state.minedGems}
                  jewelry={this.state.jewelry} 
                  jewelryContract={this.state.makeJew}
                  account={this.state.account} 
                  selectingContract={this.state.gemstroneSelecting}
                  replaceGem={this.replaceGem}  // Ezt így kell átadni
                />
              </ProtectedRoute>
            } />
            <Route path="/jewelry-making/gem/:id" element={
              <ProtectedRoute>
                <JewelryForm 
                  jewelryMaking={this.jewelryMaking}
                  markGemAsUsed={this.markGemAsUsed} 
                />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
