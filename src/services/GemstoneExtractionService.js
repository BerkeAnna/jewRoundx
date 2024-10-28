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



  async gemMining(gemType, price, metadataUrl, purchased, fileUrl) {
    try {
        if (!this.contract) await this.loadContract();
        
        console.log("Gem Type:", gemType);
        console.log("Price:", price.toString());
        console.log("Metadata URL:", metadataUrl);
        console.log("Purchased:", purchased);
        console.log("File URL:", fileUrl);
  
        const transaction = await this.contract.gemMining(
            gemType,
      ethers.utils.parseEther(price.toString()),
            metadataUrl,
            purchased,
            fileUrl
        );
  
        await transaction.wait();  // Megvárjuk, hogy a tranzakció blokkláncra kerüljön
  
        console.log("gemMining transaction successful:", transaction);
    } catch (error) {
        console.error("Error in gemMining:", error);
        throw new Error("Failed to execute gemMining. Check the console for details.");
    }
  }
  

  async purchaseGem(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.purchaseGem(id);
  }

  async processingGem(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseUnits(price.toString(), "ether"); // Konverzió Ether formátumba
    return this.contract.processingGem(id, { value: priceInEther });
  }
  
  async markNewOwner(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseUnits(price.toString(), "ether"); // Konverzió Ether formátumba
    return this.contract.markNewOwner(id, { value: priceInEther });
  }
  

  async markGemAsSelected(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markGemAsSelected(id);
  }
}

export default new GemstoneExtractionService();
