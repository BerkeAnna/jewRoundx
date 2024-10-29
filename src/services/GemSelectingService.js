import { ethers } from 'ethers';
import GemSelecting from '../abis/GemstoneSelecting.json';

class GemSelectingService {
  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
    } else {
      console.error("Ethereum provider not found. Please install MetaMask.");
    }
    this.contract = null;
  }

  // Szerződés betöltése
  async loadContract() {
    const contractAddress = process.env.REACT_APP_GEMSTONE_SELECTING_ADDRESS;
    if (contractAddress) {
      console.log("GemSelecting Contract Address:", contractAddress); // Szerződés címének ellenőrzése
      this.contract = new ethers.Contract(contractAddress, GemSelecting.abi, this.signer);
    } else {
      throw new Error('Gemstone selecting contract not deployed.');
    }
  }

// Drágakő kiválasztása (gemSelecting)
async gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price, account) {
  if (!this.contract) {
    await this.loadContract();
  }

  // Az Etherben megadott `price` átkonvertálása Wei-be
  const priceInWei = ethers.utils.parseUnits(price.toString(), 'ether'); // Ether konverzió Wei-re
  
  const gemDetails = {
    size,
    carat,
    gemType: colorGemType.split(',')[0].split(': ')[1],  // GemType
    color: colorGemType.split(',')[1].split(': ')[1]      // Color
  };

  return this.contract.gemSelecting(minedGemId, gemDetails, fileUrl, priceInWei, { from: account });
}


  // Drágakő polírozása (polishGem)
  async polishGem(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }

    const tx = await this.contract.polishGem(id, { from: account });
    return await tx.wait(); // Várakozás a tranzakció befejezésére
  }

  // Drágakő felhasználásának megjelölése (markGemAsUsed)
  async markGemAsUsed(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }

    const tx = await this.contract.markGemAsUsed(id, { from: account });
    return await tx.wait(); // Várakozás a tranzakció befejezésére
  }

  // Drágakő cseréjének megjelölése (markGemAsReplaced)
  async markGemAsReplaced(id, account) {
    if (!this.contract) {
      await this.loadContract();
    }
    const tx = await this.contract.markGemAsReplaced(id, { from: account });
    return await tx.wait(); // Várakozás a tranzakció befejezésére
  }

  // Drágakő tulajdonjogának átruházása (transferGemOwnership) - Ether értékkel
  async transferGemOwnership(id, price, account) {
    if (!this.contract) {
      await this.loadContract();
    }
  
    if (!account) {
      throw new Error("No valid account address provided.");
    }
  
    const priceInWei = ethers.utils.parseEther(price.toString()); // Konvertálás Wei-be
  
    const tx = await this.contract.transferGemOwnership(id, { from: account, value: priceInWei });
    return await tx.wait(); // Várakozás a tranzakció befejezésére
  }
}

export default new GemSelectingService();
