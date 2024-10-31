import React, { Component } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import GemstoneExtraction from './abis/GemstoneExtraction.json';
import GemSelecting from './abis/GemstoneSelecting.json';
import Jewelry from './abis/Jewelry.json';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/Routes';
import GemstoneExtractionService from './services/GemstoneExtractionService';
import GemSelectingService from './services/GemSelectingService';
import JewelryService from './services/JewelryService';

class App extends Component {
  async componentDidMount() {
    await this.loadProviderAndSigner();
    await this.loadBlockchainData();
    await this.loadBlockchainData2();
    await this.loadBlockchainData3();
  }

  async loadProviderAndSigner() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      this.setState({ account, provider, signer, isLoggedIn: true });
    } else {
      window.alert('Non-Ethereum browser detected. Please install MetaMask!');
    }
  }

  async loadBlockchainData() {
    const { provider, signer } = this.state;
    const account = await signer.getAddress();
    this.setState({ account });

    const gemstoneExtractionAddress = process.env.REACT_APP_GEMSTONE_EXTRACTION_ADDRESS;
    console.log("Gemstone Extraction Contract Address:", gemstoneExtractionAddress); // Ellenőrzés

    if (!gemstoneExtractionAddress) {
        window.alert("Gemstone Extraction contract address not found in environment.");
        return;
    }

    try {
        const gemstoneExtraction = new ethers.Contract(
            gemstoneExtractionAddress,
            GemstoneExtraction.abi,
            signer
        );

        // Lekérjük a bányászott gemek számát
        const minedGemCount = await gemstoneExtraction.minedGemCount();
        this.setState({ gemstoneExtraction, minedGemCount: minedGemCount.toNumber(), loading: false });

        // Frissítjük a `minedGems` tömböt
        let minedGems = [];
        for (let i = 1; i <= minedGemCount; i++) {
            const gem = await gemstoneExtraction.minedGems(i);
            const formattedGem = {
                ...gem,
                price: ethers.utils.formatEther(gem.price), // átalakítás ETH stringre
                id: gem.id.toNumber() // átalakítás sima számra, ha szükséges
            };
            minedGems.push(formattedGem);
        }

        this.setState({ minedGems, loading: false });
        console.log("Mined Gems:", this.state.minedGems);

    } catch (error) {
        console.error("Error in loadBlockchainData:", error); // Logold a hibát
        window.alert(`Error loading blockchain data: ${error.message}`);
    }
}


  
  
  

  async loadBlockchainData2() {
    const { provider, signer, account } = this.state;
    
    // Használjuk az .env változót a GemstoneSelecting címhez
    const gemSelectingAddress = process.env.REACT_APP_GEMSTONE_SELECTING_ADDRESS;
    
    if (!gemSelectingAddress) {
      window.alert("Gemstone Selecting contract address not found in environment.");
      return;
    }
  
    const gemstoneSelecting = new ethers.Contract(
      gemSelectingAddress,
      GemSelecting.abi,
      signer
    );
  
    const selectedGemCount = await gemstoneSelecting.selectedGemCount();
    this.setState({ gemstoneSelecting, selectedGemCount: selectedGemCount.toNumber() });
  
    let cuttedGemCount = 0;
    for (let i = 1; i <= selectedGemCount; i++) {
      const selectedGem = await gemstoneSelecting.getSelectedGem(i);
      if (selectedGem.owner === account) {
        cuttedGemCount++;
      }
      this.setState({ selectedGems: [...this.state.selectedGems, selectedGem] });
    }
    this.setState({ cuttedGemCount, loading: false });
  }
  
  

  async loadBlockchainData3() {
    const { provider, signer, account } = this.state;
    const jewelryAddress = process.env.REACT_APP_JEWELRY_ADDRESS;
  
    // Ellenőrizd, hogy a szerződés cím elérhető-e
    if (!jewelryAddress) {
      window.alert("Jewelry contract address not found in environment.");
      return;
    }
  
    const makeJew = new ethers.Contract(jewelryAddress, Jewelry.abi, signer);
    this.setState({ makeJew });
  
    const jewelryCount = await makeJew.jewelryCount();
    this.setState({ jewelryCount: jewelryCount.toNumber() });
  
    let ownedJewelryCount = 0;
    let ownedMadeJewelryCount = 0;
    let jewelryList = []; // Ideiglenes tömb a jewelry elemek tárolásához
  
    for (let i = 1; i <= jewelryCount; i++) {
      const jewelry = await makeJew.jewelry(i);
      if (jewelry.owner === account) {
        ownedJewelryCount++;
      }
      if (jewelry.jeweler === account) {
        ownedMadeJewelryCount++;
      }
      jewelryList.push(jewelry); // Adjuk hozzá a jewelry elemet a listához
    }
  
    // Egyszerre frissítjük a state-et a jewelryList tömbbel
    this.setState({ jewelry: jewelryList, ownedJewelryCount, ownedMadeJewelryCount, loading: false });
  }
  
  

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      minedGemCount: 0,
      selectedGemCount: 0,
      ownedMinedGemCount: 0,
      cuttedGemCount: 0,
      ownedJewelryCount: 0,
      minedGems: [],
      selectedGems: [],
      jewelry: [],
      isLoggedIn: false,
      loading: true,
    };

    this.gemMining = this.gemMining.bind(this);
    this.purchaseGem = this.purchaseGem.bind(this);
    this.processingGem = this.processingGem.bind(this);
    this.markGemAsSelected = this.markGemAsSelected.bind(this);
    this.gemSelecting = this.gemSelecting.bind(this);
    this.polishGem = this.polishGem.bind(this);
    this.markGemAsUsed = this.markGemAsUsed.bind(this);
    this.markGemAsReplaced = this.markGemAsReplaced.bind(this);
    this.jewelryMaking = this.jewelryMaking.bind(this);
    this.updateGem = this.updateGem.bind(this);
    this.markedAsFinished = this.markedAsFinished.bind(this);
    this.markedAsSale = this.markedAsSale.bind(this);
    this.replaceGem = this.replaceGem.bind(this);
    this.addForRepair = this.addForRepair.bind(this);
    this.returnToOwner = this.returnToOwner.bind(this);
    this.markNewOwner = this.markNewOwner.bind(this);
    this.transferGemOwnership = this.transferGemOwnership.bind(this);
    this.buyJewelry = this.buyJewelry.bind(this);
    this.getJewelryDetails = this.getJewelryDetails.bind(this);

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
    await JewelryService.buyJewelry(id, price, account);
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


transferGemOwnership = async (id, price) => {
  try {
    this.setState({ loading: true });
    const account = this.state.account;

    // Call the method from GemSelectingService
    await GemSelectingService.transferGemOwnership(id, price, account);

    // Update blockchain data after the transaction
    await this.loadBlockchainData(); 
    this.setState({ loading: false }); 
  } catch (error) {
    console.error("Error in transferGemOwnership:", error);
    this.setState({ loading: false }); 
  }
};


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

// In App.js

async getJewelryDetails(id) {
  try {
    this.setState({ loading: true });
    const jewelryDetails = await JewelryService.getJewelryDetails(id);
    this.setState({ selectedJewelryDetails: jewelryDetails, loading: false });
  } catch (error) {
    console.error("Error fetching jewelry details:", error);
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
            getJewelryDetails = {this.getJewelryDetails}
          />
        </Router>
      </div>
    );
  }

}

export default App;