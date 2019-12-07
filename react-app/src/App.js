import React , {Component} from 'react';
import { withRouter } from 'react-router-dom'; 
import Web3 from 'web3';
import './App.css';
import {ERC721_ABI,ERC721_ADDRESS} from './config'
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
  const erc721Contract= new web3.eth.Contract(ERC721_ABI,ERC721_ADDRESS)
  //this.setState({erc721Contract})
  console.log(erc721Contract.options.address) 
  const numberOfTotalTokens = await erc721Contract.methods.totalNumberOfTokens().call()
  const nameRegistry= await erc721Contract.methods.registryName().call()
  this.setState({numberOfTotalTokens})
  this.setState({nameRegistry})
  console.log(numberOfTotalTokens)
  console.log(nameRegistry)
  
 

  
  } 

  clickMe(){
    //window.open("http://localhost:3004/usertokens"); 
    //this.setState({ this.i})
  }

  constructor(props){
    super(props)
    this.state = {network:'',chainId :'',lastBlockNumber:'',
  registryName:'',numberOfTotalTokens:'',userAddress:''}
  }

  loadUserAddress = (event)=>{
    this.setState({userAddress: event.target.value})
  };
  render(){
  return ( 
    <div className="container">
      <h1>  My React App </h1>
      <p>   Your network is {this.state.network}</p>
      <p>   Chain Id = {this.state.chainId}</p>
      <p>   Last Block Number = {this.state.lastBlockNumber}</p> 
      <p>   The contract name registry is {this.state.nameRegistry}</p>
      <p>   the total number of tokens is = {this.state.numberOfTotalTokens}</p>
      <div>
        
          <p><input type='text' placeholder='User Address' name='userAdress'
          onChange={this.loadUserAddress}/>
        <button onClick={this.clickMe}>User Tokens</button>
           </p>
        
        
        <form>
          <p><input type='text' placeholder='Token Address' name='TokenAddress'/>
            <button>Token characteristics</button></p>
        </form>
      </div>
    </div>
  );
}}

export default App;
