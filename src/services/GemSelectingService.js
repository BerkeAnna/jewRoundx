import Web3 from 'web3';
import GemSelecting from '../abis/GemstoneSelecting.json';

class GemSelectingService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
    this.contract = null;
  }

  // Szerződés betöltése
  async loadContract() {
    const networkId = await this.web3.eth.net.getId();
    const networkData = GemSelecting.networks[networkId];
    if (networkData) {
      this.contract = new this.web3.eth.Contract(GemSelecting.abi, networkData.address);
    } else {
      throw new Error('Gemstone selecting contract not deployed.');
    }
  }

  // Drágakő kiválasztása (gemSelecting) - Az off-chain hash, minedGemId és az ár elküldése
  async gemSelecting(minedGemId, metadataHash, price, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    
    return this.contract.methods.gemSelecting(minedGemId, metadataHash, price).send({
      from: account
    });
  }

  // Drágakő polírozása (polishGem)
  async polishGem(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }

    return this.contract.methods.polishGem(id).send({
      from: account
    });
  }

  // Drágakő felhasználásának megjelölése (markGemAsUsed)
  async markGemAsUsed(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }

    return this.contract.methods.markGemAsUsed(id).send({
      from: account
    });
  }

  async markGemAsReplaced(id, account) {
    if (!this.contract) {
      await this.loadContract(); 
    }
    return this.contract.methods.markGemAsReplaced(id).send({
      from: account
    });
  }

  // Drágakő tulajdonjogának átruházása (transferGemOwnership) - Ether értékkel
  async transferGemOwnership(id, price, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }

    if (!account) {
      throw new Error("No valid account address provided.");
    }

    // Gas limit és gas price hozzáadása a tranzakcióhoz
    const gasLimit = 300000;  
    const gasPrice = await this.web3.eth.getGasPrice(); 

    // Drágakő tulajdonjogának átruházása a megadott Ether értékkel
    return this.contract.methods.transferGemOwnership(id).send({ 
      from: account, 
      value: price, 
      gas: gasLimit, 
      gasPrice: gasPrice 
    });
  }
}

export default new GemSelectingService();
