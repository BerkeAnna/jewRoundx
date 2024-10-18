import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GemstoneExtraction from './abis/GemstoneExtraction.json';
import GemSelecting from './abis/GemstoneSelecting.json';
import Jewelry from './abis/Jewelry.json';
import UserRegistryABI from './abis/UserRegistry.json'; 
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/Routes';
import GemstoneExtractionService from './services/GemstoneExtractionService';
import GemSelectingService from './services/GemSelectingService';
import JewelryService from './services/JewelryService';


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
  
      // Ell. a felhasználó regisztrálva van-e
      const isRegistered = await userRegistry.methods.isUserRegistered(accounts[0]).call();
      if (!isRegistered) {
        console.error('User is not registered');
        window.alert('User is not registered in the system');
        return;
      }
  
      // Ha regisztrálva van, felhasználói adatokat lekérjük
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
      selectedGemCount: 0,
      ownedMinedGemCount: 0,
      ownedMadeJewelry: 0,
      cuttedGemCount: 0,
      ownedJewelryCount: 0,
      minedGems: [],
      selectedGems: [],
      jewelry: [],
      isLoggedIn: false,
      loading: true,
      userInfo: null,
      gemstroneExtraction: null, 
      gemstroneSelecting: null, 
      makeJew: null, 
      userRegistry: null
    };
  
    this.gemMining = this.gemMining.bind(this);
    this.purchaseGem = this.purchaseGem.bind(this);
    this.processingGem = this.processingGem.bind(this);
    this.markGemAsSelected = this.markGemAsSelected.bind(this);
    this.gemSelecting = this.gemSelecting.bind(this);
    this.polishGem = this.polishGem.bind(this);
    this.markGemAsUsed = this.markGemAsUsed.bind(this);
    this.jewelryMaking = this.jewelryMaking.bind(this);
    this.updateGem = this.updateGem.bind(this);
    this.markedAsFinished = this.markedAsFinished.bind(this);
    this.markedAsSale = this.markedAsSale.bind(this);
    this.replaceGem = this.replaceGem.bind(this);
    this.buyJewelry = this.buyJewelry.bind(this);
    this.markNewOwner = this.markNewOwner.bind(this);
    this.transferGemOwnership = this.transferGemOwnership.bind(this);
    this.addForRepair = this.addForRepair.bind(this);
    this.returnToOwner = this.returnToOwner.bind(this);
    this.markGemAsReplaced = this.markGemAsReplaced.bind(this);
    /* 
    this.refreshPage = this.refreshPage.bind(this);
    
*/
}


async gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased) {
  try {
    this.setState({ loading: true });
    const account = this.state.account; 

    // GemstoneExtractionService-től hívjuk a gemMining fv-t
    await GemstoneExtractionService.gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased, account);
      
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); // Betöltés vége
  } catch (error) {
    console.error("Error in gemMining: ", error);
    this.setState({ loading: false }); 
  }
}

async purchaseGem(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // GemstoneExtractionService-től hívjuk a purchaseGem fv-t
    await GemstoneExtractionService.purchaseGem(id, account);
      
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData();
    this.setState({ loading: false });
  } catch (error) {
    console.error("Error in purchaseGem :", error);
    this.setState({ loading: false });
  }
}


  async processingGem(id, price) {
    try {
      this.setState({ loading: true });
      const account = this.state.account;

      // GemstoneExtractionService-től hívjuk a processingGem fv-t
      await GemstoneExtractionService.processingGem(id, price, account);
      
      // tranzakció után frissítjük a blokklánc adatokat
      this.setState({ loading: false });

    } catch (error) {
      console.error("Error in processingGem:", error);
      this.setState({ loading: false });
    }
}

async markGemAsSelected(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // GemstoneExtractionService-től hívjuk a markGemAsSelected fv-t
    await GemstoneExtractionService.markGemAsSelected(id, account);
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData();
    this.setState({ loading: false });
  } catch (error) {
    console.error("Error in markGemAsSelected:", error);
    this.setState({ loading: false });
  }
}


async gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;  // Ellenőrizd, hogy az `account` megfelelően van beállítva
    
    if (!account) {
      throw new Error("Account is not available.");
    }

    // GemSelectingService-től hívjuk a gemSelecting függvényt
    await GemSelectingService.gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price, account);
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false });
  } catch (error) {
    console.error("Error in gemSelecting: ", error);
    this.setState({ loading: false });
  }
}


async polishGem(id) {

  try {
    this.setState({ loading: true });
    const account = this.state.account;
    
    // GemSelectingService-től hívjuk a polishGem fv-t
    await GemSelectingService.polishGem(id, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in polishGem: ", error);
    this.setState({ loading: false }); 
  }
}

async markGemAsUsed(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;
    
    // GemSelectingService-től hívjuk a markGemAsUsed fv-t
    GemSelectingService.markGemAsUsed(id, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in markGemAsUsed: ", error);
    this.setState({ loading: false }); 
  }
}

async jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL) {  
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a jewelryMaking fv-t
    JewelryService.jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in jewelryMaking: ", error);
    this.setState({ loading: false }); 
  }
}

async updateGem(jewelryId, newGemId) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a updateGem fv-t
    await JewelryService.updateGem(jewelryId, newGemId, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in updateGem: ", error);
    this.setState({ loading: false }); 
  }
}

async markedAsFinished(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a markedAsFinished fv-t
    await JewelryService.markedAsFinished(id, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in markedAsFinished: ", error);
    this.setState({ loading: false }); 
  }
}

async markedAsSale(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a markedAsSale fv-t
    JewelryService.markedAsSale(id, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in markedAsSale: ", error);
    this.setState({ loading: false }); 
  }
}

async replaceGem(jewelryId, oldGemId, newGemId) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a replaceGem fv-t
    await JewelryService.replaceGem(jewelryId, oldGemId, newGemId, account)

    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in replaceGem: ", error);
    this.setState({ loading: false }); 
  }
}


async buyJewelry(id, price) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a buyJewelry fv-t
    await JewelryService.buyJewelry(id, price, account);

    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData3(); 
    this.setState({ loading: false });

  } catch (error) {
    console.error("Error in buyJewelry:", error);
    this.setState({ loading: false });
  }
}

async markGemAsReplaced(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;
    
    // GemSelectingService-től hívjuk a markGemAsUsed fv-t
    GemSelectingService.markGemAsReplaced(id, account)
    
    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in markGemAsReplaced: ", error);
    this.setState({ loading: false }); 
  }
}
  
//todo: service
async markNewOwner(id, price) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // GemSelectingService-től hívjuk a markNewOwner fv-t
    await GemstoneExtractionService.markNewOwner(id, price, account);

    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false });

  } catch (error) {
    console.error("Error in markNewOwner:", error);
    this.setState({ loading: false });
  }
}


async transferGemOwnership(id, price) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // GemSelectingService-től hívjuk a transferGemOwnership fv-t
    await GemSelectingService.transferGemOwnership(id,  price , account);

    // tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in transferGemOwnership:", error);
    this.setState({ loading: false }); 
  }
}

async addForRepair(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a addForRepair fv-t
    await JewelryService.addForRepair(id, account);

    // Tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false });
  } catch (error) {
    console.error("Error in addForRepair: ", error);
    this.setState({ loading: false });
  }
}

async returnToOwner(id) {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // JewelryService-től hívjuk a addForRepair fv-t
    await JewelryService.returnToOwner(id, account);

    // Tranzakció után frissítjük a blokklánc adatokat
    await this.loadBlockchainData(); 
    this.setState({ loading: false });
  } catch (error) {
    console.error("Error in returnToOwner: ", error);
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
          {this.state.isLoggedIn && window.location.pathname !== "/" && window.location.pathname !== "/loggedIn" && <Navbar account={this.state.account} />}
          <AppRoutes 
            state={this.state} 
            gemMining={this.gemMining}
            gemSelecting={this.gemSelecting} 
            purchaseGem={this.purchaseGem}
            markNewOwner={this.markNewOwner}
            markGemAsSelected={this.markGemAsSelected}
            processingGem = {this.processingGem}
            markGemAsUsed = {this.markGemAsUsed}
            polishGem = {this.polishGem}
            jewelryMaking = {this.jewelryMaking}
            buyJewelry = {this.buyJewelry}
            refreshPage = {this.refreshPage}
            transferGemOwnership = {this.transferGemOwnership}
            updateGem = {this.updateGem}
            markedAsFinished = {this.markedAsFinished}
            markedAsSale = {this.markedAsSale}
            replaceGem = {this.replaceGem}
            addForRepair = {this.addForRepair}
            returnToOwner = {this.returnToOwner}
            markGemAsReplaced = {this.markGemAsReplaced}
          />
        </Router>
      </div>
    );
  }

}

export default App;