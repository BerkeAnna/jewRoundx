import { ethers } from 'ethers';
import Jewelry from '../abis/Jewelry.json';

class JewelryService {
  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = null;
  }

  async loadContract() {
    const networkId = (await this.provider.getNetwork()).chainId;
    const networkData = Jewelry.networks[networkId];
    if (networkData) {
      this.contract = new ethers.Contract(networkData.address, Jewelry.abi, this.signer);
    } else {
      throw new Error('Jewelry contract not deployed to detected network.');
    }
  }

  async jewelryMaking(name, gemId, metadataHash, sale, price, fileURL) {  
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.jewelryMaking(name, gemId, metadataHash, sale, priceInEther, fileURL);
  }

  async updateGem(jewelryId, newGemId) {
    if (!this.contract) await this.loadContract();
    return this.contract.updateGem(jewelryId, newGemId);
  }

  async markedAsFinished(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markedAsFinished(id);
  }

  async markedAsSale(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markedAsSale(id);
  }

  async replaceGem(jewelryId, oldGemId, newGemId) {
    if (!this.contract) await this.loadContract();
    return this.contract.replaceGem(jewelryId, oldGemId, newGemId);
  }

  async buyJewelry(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.buyJewelry(id, { value: priceInEther });
  }

  async addForRepair(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.addForRepair(id);
  }

  async returnToOwner(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.returnToJewOwner(id);
  }
}

export default new JewelryService();
