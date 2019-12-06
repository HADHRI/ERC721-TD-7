import React , {Component} from 'react';
import Web3 from 'web3';
import './App.css';
class App extends Component{

  componentWillMount(){
    this.loadBlockchainData()
  }
  
  //Interacting with  the blockchain 
  //retrieving the chainId and the lastBlockNumber
  async loadBlockchainData(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    //using await because it is a sync function
   const network= await web3.eth.net.getNetworkType()
   const chainId =await web3.eth.getChainId()
   const lastBlock= await web3.eth.getBlock('latest')
   this.setState({chainId : chainId,lastBlockNumber : lastBlock.number,
  network : network})
  } 

  constructor(props){
    super(props)
    this.state = {chainId :'',lastBlockNumber:''}
  }
  render(){
  return (
    <div className="container">
      <h1>My React App </h1>
      <p>   Your network is {this.state.network}</p>
      <p>   Chain Id = {this.state.chainId}</p>
      <p>   Last Block Number = {this.state.lastBlockNumber}</p> 
    </div>
  );
}}

export default App;
