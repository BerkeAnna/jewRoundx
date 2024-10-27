import { ethers } from 'ethers';
import GemSelecting from '../abis/GemstoneSelecting.json';

class GemSelectingService {
  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = null;
  }

  // Szerződés betöltése
  async loadContract() {
    const networkId = (await this.provider.getNetwork()).chainId;
    const networkData = GemSelecting.networks[networkId];
    if (networkData) {
      this.contract = new ethers.Contract(networkData.address, GemSelecting.abi, this.signer);
    } else {
      throw new Error('Gemstone selecting contract not deployed.');
    }
  }

  // Drágakő kiválasztása (gemSelecting) - Az off-chain hash, minedGemId és az ár elküldése
  async gemSelecting(minedGemId, metadataHash, price, fileUrl) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.gemSelecting(minedGemId, metadataHash, priceInEther, fileUrl);
  }

  // Drágakő polírozása (polishGem)
  async polishGem(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.polishGem(id);
  }

  // Drágakő felhasználásának megjelölése (markGemAsUsed)
  async markGemAsUsed(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markGemAsUsed(id);
  }

  async markGemAsReplaced(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markGemAsReplaced(id);
  }

  // Drágakő tulajdonjogának átruházása (transferGemOwnership) - Ether értékkel
  async transferGemOwnership(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.transferGemOwnership(id, { value: priceInEther });
  }
}

export default new GemSelectingService();
