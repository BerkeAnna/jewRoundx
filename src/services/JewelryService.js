import Web3 from 'web3';
import Jewelry from '../abis/Jewelry.json';

class JewelryService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
  }

  async loadContract() {
    const networkId = await this.web3.eth.net.getId();
    const networkData = Jewelry.networks[networkId];
    if (networkData) {
      this.contract = new this.web3.eth.Contract(Jewelry.abi, networkData.address);
    } else {
      throw new Error('Jewelry contract not deployed to detected network.');
    }
  }

  async jewelryMaking(name, gemId, metadataHash, sale, price, account) {  
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    return this.contract.methods.jewelryMaking(name, gemId, metadataHash, sale, price).send({ from: account })
     
  }

  
async updateGem(jewelryId, newGemId, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }
  
  return this.contract.methods.updateGem(jewelryId, newGemId).send({ from: account})
    
  }

  async markedAsFinished(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    return this.contract.methods.markedAsFinished(id).send({ from: account })
       
}

async markedAsSale(id, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }
  return this.contract.methods.markedAsSale(id).send({ from: account })
    
}


 async replaceGem(jewelryId, oldGemId, newGemId, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    return this.contract.methods.replaceGem(jewelryId, oldGemId, newGemId).send({ from: account })
     
  }
  


async buyJewelry(id, price, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }

  if (!account) {
    throw new Error("No valid account address provided.");
  }

  const gasLimit = 300000;  
  const gasPrice = await this.web3.eth.getGasPrice();

  return this.contract.methods.buyJewelry(id).send({
    from: account,
    value: price,  
    gas: gasLimit,
    gasPrice: gasPrice
  });
}

 
async addForRepair(id, account) {
  if (!this.contract) {
    await this.loadContract(); // Szerződés betöltése
  }
  return this.contract.methods.addForRepair(id).send({ from: account });
}
async returnToOwner(id, account) {
  if (!this.contract) {
    await this.loadContract(); // Szerződés betöltése
  }
  return this.contract.methods.returnToJewOwner(id).send({ from: account });
}


}

export default new JewelryService();