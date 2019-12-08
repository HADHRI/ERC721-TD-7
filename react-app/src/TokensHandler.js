import React , {Component} from 'react';
import { Route, BrowserRouter as Router ,Link} from 'react-router-dom'
import Web3 from 'web3';
import ReactDOM from 'react-dom';
import {ERC721_ABI,ERC721_ADDRESS} from './config' 

class TokensHandler extends Component{

  componentWillMount(){
  //  this.loadBlockchainData()
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
    //this.setState({erc721Contract})
    console.log(erc721Contract.options.address)
    const numberOfTotalTokens = await erc721Contract.methods.totalNumberOfTokens().call()
    const nameRegistry= await erc721Contract.methods.registryName().call()
    this.setState({numberOfTotalTokens})
    this.setState({nameRegistry})
    this.setState({erc721Contract})
    console.log(numberOfTotalTokens)
    console.log(nameRegistry)
    }
    
   constructor(props){
  super(props)
  
 this.state = {network:'',chainId :'',lastBlockNumber:'',
registryName:'',numberOfTotalTokens:'',userAddress:'',userTokensIsPressed:false,numberOfTokensOfUser:''}

  }

loadUserAddress = (event)=>{ 
  // Getting the user Address
  this.userAddress=event.target.value  
  };

   switchUserTokenIsPressed=async()=>{ 
  
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
  const erc721Contract= new web3.eth.Contract(ERC721_ABI,ERC721_ADDRESS)
  //Now we will call the method to know number of token of this User  
  try{
    const numberOfTokensOfUser= await erc721Contract.methods._ownedTokensCount(this.userAddress).call()
    this.setState({userTokensIsPressed:true}) 
    this.setState({numberOfTokensOfUser}) 
  }
  catch{
    this.setState({userTokensIsPressed:false}) 
    alert("please Verify that your address is correct")
    console.log("please Verify that your address is correct") 
    
  }
  };

  renderTokensNumber(props) {
    if (!props.userTokensIsPressed) {
      return null; 
    }

   return (
      <div >
        This user had {props.numberOfTokensOfUser} tokens
      </div>
    );
  }
  render(){
  return (
  <div className="container">

<p></p>
<div> 
<input type='text' placeholder='User Address' name='userAddress'
onChange={this.loadUserAddress}/>
<button onClick={this.switchUserTokenIsPressed} >User Tokens</button>  
</div>
<this.renderTokensNumber userTokensIsPressed={this.state.userTokensIsPressed} numberOfTokensOfUser={this.state.numberOfTokensOfUser} userAddress={this.state.userAddress}/>

    
<p><input type='text' placeholder='Token iD' name='TokenId'/>
<button>Token characteristics</button></p>
<Link to={"/"}>Click here to return to HomePage</Link>
  </div>
  );
  }}


 
  

export default TokensHandler;