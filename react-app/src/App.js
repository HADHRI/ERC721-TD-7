import React , {Component} from 'react';
import {browserHistory} from "react-router";
import { Route, BrowserRouter as Router ,Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import Web3 from 'web3';
import './App.css';
import TokenNumberHandler from './TokensHandler'
import {ERC721_ABI,ERC721_ADDRESS} from './config'
import ReactDOM from 'react-dom';
class App extends Component{

componentWillMount(){
this.loadBlockchainData()
}

//Interacting with the blockchain
//retrieving the chainId and the lastBlockNumber
async loadBlockchainData(){
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//using await because it is a sync function
const network= await web3.eth.net.getNetworkType()
const chainId =await web3.eth.getChainId()
const lastBlock= await web3.eth.getBlock('latest')
this.setState({chainId : chainId,lastBlockNumber : lastBlock.number,
network : network})
const erc721Contract= new web3.eth.Contract(ERC721_ABI,ERC721_ADDRESS)
console.log(erc721Contract.options.address)
const numberOfTotalTokens = await erc721Contract.methods.totalNumberOfTokens().call()
const registryName= await erc721Contract.methods.registryName().call()
this.setState({numberOfTotalTokens})
this.setState({registryName})
console.log(numberOfTotalTokens)
console.log(registryName)
}


clickMe = () => {
  
}


constructor(props){
super(props)
this.state = {network:'',chainId :'',lastBlockNumber:'',
registryName:'',numberOfTotalTokens:'',userAddress:'',varName:'aa'}
}

render(){
return (
<div className="container">
<h1> My React App </h1>
<p> Your network is {this.state.network}</p>
<p> Chain Id = {this.state.chainId}</p>
<p> Last Block Number = {this.state.lastBlockNumber}</p>
<p> The contract name registry is {this.state.registryName}</p>
<p> the total number of tokens is = {this.state.numberOfTotalTokens}</p>
<p><Link to={"/informations/Tokens-and-users"}>Click here to show tokens and user Informations</Link></p>
<p><Link to={"/buy-animal"}>Click here to buy new Animal </Link></p>
<div>
</div>
</div>
);
}}

export default App;
