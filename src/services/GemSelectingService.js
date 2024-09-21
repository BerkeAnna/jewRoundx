import Web3 from 'web3';
import GemSelecting from '../abis/GemstoneSelecting.json';

class GemSelectingService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
  }

  async loadContract() {
    const networkId = await this.web3.eth.net.getId();
    const networkData = GemSelecting.networks[networkId];
    if (networkData) {
      this.contract = new this.web3.eth.Contract(GemSelecting.abi, networkData.address);
    } else {
      throw new Error('Gemstone selecting contract not deployed.');
    }
  }


async gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }
  return this.contract.methods.gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price).send({ from: account })
   
}

async polishGem(id, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }
  return this.contract.methods.polishGem(id).send({
    from: account
  });
  
}

  async markGemAsUsed(id, account) {
    if (!this.contract) {
      await this.loadContract(); // betöltjük a szerződést
    }
    return this.contract.methods.markGemAsUsed(id).send({
      from: account
    });
    
  }
  
async transferGemOwnership(id, price, account) {
  if (!this.contract) {
    await this.loadContract(); // betöltjük a szerződést
  }

  if (!account) {
    throw new Error("No valid account address provided.");
  }

  const gasLimit = 300000;  
  const gasPrice = await this.web3.eth.getGasPrice(); 

  return this.contract.methods.transferGemOwnership(id).send({ 
    from: account, 
    value: price, 
    gas: gasLimit, 
    gasPrice: gasPrice 
  });
}

}

export default new GemSelectingService();
