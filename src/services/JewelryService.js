import { ethers } from 'ethers';
import Jewelry from '../abis/Jewelry.json';

class JewelryService {
  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
    this.contract = null;
  }

  // Load the contract using the address specified in environment variables or configuration
  async loadContract() {
    const contractAddress = process.env.REACT_APP_JEWELRY_ADDRESS; // Set this in your .env file

    if (contractAddress) {
      this.contract = new ethers.Contract(contractAddress, Jewelry.abi, this.signer);
    } else {
      throw new Error('Jewelry contract not deployed to the detected network.');
    }
  }

  async jewelryMaking(name, gemId, metadataHash, sale, price, fileURL, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.jewelryMaking(name, gemId, metadataHash, sale, price, fileURL, { from: account });
    return await tx.wait();
  }

  async updateGem(jewelryId, newGemId, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.updateGem(jewelryId, newGemId, { from: account });
    return await tx.wait();
  }

  async markedAsFinished(id, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.markedAsFinished(id, { from: account });
    return await tx.wait();
  }

  async markedAsSale(id, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.markedAsSale(id, { from: account });
    return await tx.wait();
  }

  async replaceGem(jewelryId, oldGemId, newGemId, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.replaceGem(jewelryId, oldGemId, newGemId, { from: account });
    return await tx.wait();
  }

  async buyJewelry(id, price, account) {
    if (!this.contract) {
      await this.loadContract();
    }

    if (!account) {
      throw new Error("No valid account address provided.");
    }

    // Send the price in wei (assuming price is in Ether and needs conversion)
    const priceInWei = ethers.utils.parseUnits(price.toString(), 'ether');
    const tx = await this.contract.buyJewelry(id, { from: account, value: priceInWei });
    return await tx.wait();
  }

  async addForRepair(id, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.addForRepair(id, { from: account });
    return await tx.wait();
  }

  async returnToOwner(id, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.returnToJewOwner(id, { from: account });
    return await tx.wait();
  }


  async getJewelryDetails(id) {
    if (!this.contract) {
      await this.loadContract();
    }
    return await this.contract.getJewelryDetails(id);
  }
  
}

export default new JewelryService();
