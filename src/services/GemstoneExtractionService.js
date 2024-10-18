import Web3 from 'web3';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';

class GemstoneExtractionService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
    this.contract = null; 
  }

  async loadContract() {
    const networkId = await this.web3.eth.net.getId();
    const networkData = GemstoneExtraction.networks[networkId];
    if (networkData) {
      this.contract = new this.web3.eth.Contract(GemstoneExtraction.abi, networkData.address);
    } else {
      throw new Error('Gemstone contract not deployed to detected network.');
    }
  }

  async gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased, account) {
    if (!this.contract) {
      await this.loadContract(); // Betöltjük a szerződést
    }
    return this.contract.methods.gemMining(
      gemType,
      details,
      price,
      miningLocation,
      miningYear,
      fileUrl,
      purchased
    ).send({ from: account });
  }
  

  
  async purchaseGem(id,  account) {
    if (!this.contract) {
       await this.loadContract(); // betöltjük a szerződést
    }
 
    return this.contract.methods.purchaseGem(id).send({
       from: account
    });
 }
 
  async processingGem(id, price, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
   }
   const priceInEther = window.web3.utils.fromWei(price.toString(), 'ether');
    this.setState({ loading: true });
    return this.contract.methods.processingGem(id).send({
      from: account,
      value: priceInEther 
   });
  }

  async markNewOwner(id, price, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    
    const priceInEther = window.web3.utils.fromWei(price.toString(), 'ether');
    console.log("priceInEther " + priceInEther);
    
    return this.contract.methods.markNewOwner(id).send({
      from: account,
      value: price
    });
  }
  
  async markGemAsSelected(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
  
    return this.contract.methods.markGemAsSelected(id).send({
      from: account
    });
  }
  
}

export default new GemstoneExtractionService();