import { ethers } from 'ethers';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';

class GemstoneExtractionService {
  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
    this.contract = null;
  }

  async loadContract() {
    const contractAddress = process.env.REACT_APP_GEMSTONE_EXTRACTION_ADDRESS;
    if (contractAddress) {
      this.contract = new ethers.Contract(contractAddress, GemstoneExtraction.abi, this.signer);
    } else {
      throw new Error('Gemstone contract not deployed to detected network.');
    }
  }


  async gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased, account) {
    if (!this.contract) {
      await this.loadContract(); // Betöltjük a szerződést
    }
    return this.contract.gemMining(
      gemType,
      details,
      ethers.utils.parseEther(price.toString()),
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
 
    return this.contract.purchaseGem(id, { from: account });
 }

  /*async processingGem(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseUnits(price.toString(), "ether"); // Konverzió Ether formátumba
    return this.contract.processingGem(id, { value: priceInEther });
  }
  */
  async markNewOwner(id, price, account) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseUnits(price.toString(), "ether");
    const tx = await this.contract.markNewOwner(id, { value: priceInEther, from: account });
    return await tx.wait(); // Várakozás a tranzakció befejezésére
}

  

  async markGemAsSelected(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markGemAsSelected(id);
  }

  
}

export default new GemstoneExtractionService();