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

  markGemAsUsed(id) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.markGemAsUsed(id).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in markas: ", error);
        this.setState({ loading: false });
      });
  }

  gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });

    this.state.gemstroneSelecting.methods.gemSelecting(minedGemId, size, carat, colorGemType, fileUrl, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in gemSelecting: ", error);
        this.setState({ loading: false });
      });
}

polishGem(id) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('7000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.polishGem(id).send({ from: this.state.account, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      });
  }

  transferGemOwnership(id, price) {
    const gasLimit = 90000;
    const gasPrice = window.web3.utils.toWei('8000', 'gwei');
    this.setState({ loading: true });
    this.state.gemstroneSelecting.methods.transferGemOwnership(id).send({ from: this.state.account, value: price, gasLimit: gasLimit, gasPrice: gasPrice })
      .once('receipt', (receipt) => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error in transferGemOwnership: ", error);
        this.setState({ loading: false });
      });
  }
  

  // További metódusok...
}

export default new GemSelectingService();
