import React, { Component } from 'react';
//import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import newApp from '.../abis/newApp.json';
import navBar from './navBar';
import Main from './Main';
import { bindExpression, thisExpression } from '@babel/types';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    console.log(window.web3)
    await this.loadBlockchainData()
  }

  async loadWeb3() {
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
      }   
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
      }
      // Non-dapp browsers...
      else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //load acc 
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = newApp.networks[networkId]
    if(networkData) {
      // eslint-disable-next-line no-use-before-define
      const newApp = web3.eth.Contract(newApp.abi, networkData.address)
      this.setState({ newApp })
      this.setState({ loading: false })
    }else {
      window.alert('NewApp contract not deployed() to detected network')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind 
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.newApp.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false})
    })
  }

  render() {
    return (
      <div>
        <navBar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex"></main>
            { this.state.loading 
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main createProduct={this.createProduct}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
