import Web3 from 'web3';
import Jewelry from '../abis/Jewelry.json';

class JewelryService {
  constructor() {
    this.web3 = new Web3(window.ethereum);
  }

  async loadContract() {
    const networkId = await this.web3.eth.net.getId();
    const networkData = Jewelry.networks[networkId];
    if (networkData) {
      this.contract = new this.web3.eth.Contract(Jewelry.abi, networkData.address);
    } else {
      throw new Error('Jewelry contract not deployed to detected network.');
    }
  }

  jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL) {  // physicalDetails, a combined metal and size
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.makeJew.methods.jewelryMaking(name, gemId, physicalDetails, sale, price, fileURL).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error occurred in jewelryMaking function: ", error);
        this.setState({ loading: false });
      });
  }

  
updateGem(jewelryId, newGemId) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
  
    this.state.makeJew.methods.updateGem(jewelryId, newGemId).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
        this.loadBlockchainData3(); // Reload data to reflect the change
      })
      .catch(error => {
        console.error("Error in updateGem: ", error);
        this.setState({ loading: false });
      });
  }
  replaceGem(jewelryId, oldGemId, newGemId) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
  
    this.state.makeJew.methods.replaceGem(jewelryId, oldGemId, newGemId).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
        this.loadBlockchainData2(); // Reload data to reflect the change
      })
      .catch(error => {
        console.error("Error in replaceGem: ", error);
        this.setState({ loading: false });
      });
  }
  



  async buyJewelry(id, price) {
    const gasLimit = 100000;
    this.setState({ loading: true });
    try {
      const receipt = await this.state.makeJew.methods.buyJewelry(id).send({ from: this.state.account, value: price, gasLimit: gasLimit });
      this.setState({ loading: false });
      this.loadBlockchainData3(); // Reload data to reflect the change
      console.log('Transaction receipt:', receipt);
    } catch (error) {
      console.error("Error in buyJewelry:", error);
      this.setState({ loading: false });
    }
  }


 

  // További metódusok...
}

export default new JewelryService();
