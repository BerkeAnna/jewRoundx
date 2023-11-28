import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import GemstoneExtraction from '../abis/GemstoneExtraction.json';
import Navbar from './Navbar';
import Main from './Main';
import Dashboard from './Dashboard';
import MinedGemsList from './MinedGemList';
import MinedGemForm from './MinedGemForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OwnedByUser from './OwnedByUser'

class App extends Component {
//2:11:30
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.ethereum);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts);
    this.setState({ account: accounts[0] })

    const networkId= await web3.eth.net.getId();
    const networkData = GemstoneExtraction.networks[networkId]
    if(networkData){
      const gemstroneExtraction = web3.eth.Contract(GemstoneExtraction.abi, networkData.address)
      this.setState({ gemstroneExtraction })
      const minedGemCount = await gemstroneExtraction.methods.minedGemCount().call()
      this.setState({ minedGemCount })

      for(var i=1; i<= minedGemCount; i++){
        const minedGems = await gemstroneExtraction.methods.minedGems(i).call()
        this.setState({
          minedGems: [...this.state.minedGems, minedGems]
        })
      }
      console.log(minedGemCount.toString())
      this.setState({loading: false})
     // console.log(this.state.minedGems)
    }else{
      //ha a networkdata nem true az ifben, akor ezt kapom. Pl ha  a mainnetre próbálom a metamaskot, szóvql lehet h az eredetiben is ez a problem? 
      window.alert('Gemstone contract not deployed to detected network. - own error')
    }
  /*
    const networkId = await web3.eth.net.getId()
    const networkData = GemstoneExtraction.networks[networkId]
    console.log(networkData)
   
    if(networkData){
      const gemsE = web3.eth.Contract(GemstoneExtraction.abi, networkData.address)
      this.setState({ gemsE })
      const minedGemCount = await gemsE.methods.minedGemCount().call()
      console.log(minedGemCount)
      console.log(gemsE.methods.minedGemCount())
      for(var i = 1 ; i<= minedGemCount; i++){
        const gem = await gemsE.methods.minedGems(i).call()
        this.setState({
          minedGems: [...this.state.minedGems, gem]
        })
      }
      this.setState({ loading: false })
    }else{
      window.alert('Gemstone extraction contract not deployed to detected network.')
    }
   */
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      minedGemCount: 0,
      minedGems: [],
      loading: true
    }

    this.gemMining = this.gemMining.bind(this)
  }

  gemMining(gemType, weight, height, width, price, miningLocation, miningYear, pointOfProcessing, extractionMethod, purchased) {
       this.setState({loading: true})
       this.state.gemstroneExtraction.methods.gemMining(gemType, weight, height, width, price, miningLocation, miningYear, pointOfProcessing, extractionMethod, purchased).send({from: this.state.account})
        .once('receipt', (receipt) => {
          this.setState({  loading: false})
        })
     
  }


  render() {
    return (
      
      <div className='col-6'> 
        <Router>
          {/* Navbar mindig látható */}
          <Navbar account={this.state.account} />
          <Routes>
          <Route path="/" element={<Dashboard  />} />
            <Route path="/addMinedGem" element={<MinedGemForm gemMining={this.gemMining} />} />
            <Route path="/minedGems" element={<MinedGemsList  minedGems={this.state.minedGems}
                                                              gemMining={this.gemMining}
                                                              purchaseGem={this.purchaseGem}
                                                              account={this.state.account}
                                                              />} />
           
            <Route path="/ownMinedGems" element={<OwnedByUser  minedGems={this.state.minedGems}
                                                               gemMining={this.gemMining}
                                                               purchaseGem={this.purchaseGem}
                                                               account={this.state.account}
                                                               sellGem={this.sellGem}
                                                                    />} />
          </Routes>
        </Router> 
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex"> 
            
            <div id="content">
             {}
            </div>

            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default App;