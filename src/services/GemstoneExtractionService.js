import Web3 from 'web3';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';

class GemstoneExtractionService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
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

  async getMinedGems(account) {
    const minedGemCount = await this.contract.methods.minedGemCount().call();
    let minedGems = [];
    for (let i = 1; i <= minedGemCount; i++) {
      const gem = await this.contract.methods.minedGems(i).call();
      if (gem.owner === account) {
        minedGems.push(gem);
      }
    }
    return minedGems;
  }

  async gemMining(gemType, details, price, miningLocation, miningYear, fileUrl, purchased) {
    this.setState({ loading: true });
    if (this.state.gemstroneExtraction) {
      this.state.gemstroneExtraction.methods.gemMining(
        gemType,
        details,
        price,
        miningLocation,
        miningYear,
        fileUrl,
        purchased
      ).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          console.log('Receipt:', receipt);
          this.loadBlockchainData();
          this.loadBlockchainData2();
          this.loadBlockchainData3();
          this.loadBlockchainData4();
          this.setState({ loading: false });
        })
        .on('error', (error) => {
          console.error("Error in gemMining: ", error);
          this.setState({ loading: false });
        });
    } else {
      console.error("gemstroneExtraction is not defined");
      this.setState({ loading: false });
    }
  }

  
  purchaseGem(id, price) {
    const gasLimit = 120000;
    const gasPrice = window.web3.utils.toWei('10000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.purchaseGem(id).send({ from: this.state.account,/* value: price,*/ gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  processingGem(id, price) {
    const gasLimit = 120000;
    const gasPrice = window.web3.utils.toWei('10000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.processingGem(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }
  markNewOwner(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
  
    this.state.gemstroneExtraction.methods.markNewOwner(id).send({ 
      from: this.state.account, 
      value: price, 
      gasLimit: gasLimit, 
      gasPrice: gasPrice 
    })
    .once('receipt', (receipt) => {
      this.setState({ loading: false });
    })
    .catch(error => {
      console.error("Error in markNewOwner: ", error);
      this.setState({ loading: false });
    });
  }
  

  markGemAsSelected(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneExtraction.methods.markGemAsSelected(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in markGemAsSelected: ", error);
        this.setState({ loading: false });
      });
  }


  // További metódusok...
}

export default new GemstoneExtractionService();
