import { ethers } from 'ethers';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';

class GemstoneExtractionService {
  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = null;
  }

  async loadContract() {
    const networkId = (await this.provider.getNetwork()).chainId;
    const networkData = GemstoneExtraction.networks[networkId];
    if (networkData) {
      this.contract = new ethers.Contract(networkData.address, GemstoneExtraction.abi, this.signer);
    } else {
      throw new Error('Gemstone contract not deployed to detected network.');
    }
  }

  async gemMining(gemType, price, metadataUrl, purchased, fileUrl) {
    if (!this.contract) await this.loadContract();
    return this.contract.gemMining(
      gemType,
      ethers.utils.parseEther(price.toString()),
      metadataUrl,
      purchased,
      fileUrl
    );
  }

  async purchaseGem(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.purchaseGem(id);
  }

  async processingGem(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.processingGem(id, { value: priceInEther });
  }

  async markNewOwner(id, price) {
    if (!this.contract) await this.loadContract();
    const priceInEther = ethers.utils.parseEther(price.toString());
    return this.contract.markNewOwner(id, { value: priceInEther });
  }

  async markGemAsSelected(id) {
    if (!this.contract) await this.loadContract();
    return this.contract.markGemAsSelected(id);
  }
}

export default new GemstoneExtractionService();
