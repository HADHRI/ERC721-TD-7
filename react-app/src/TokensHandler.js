import React , {Component} from 'react';
import { Route, BrowserRouter as Router ,Link} from 'react-router-dom'
import Web3 from 'web3';
import ReactDOM from 'react-dom';
import {ERC721_ABI,ERC721_ADDRESS} from './config' 

class TokensHandler extends Component{

  constructor(props){
  super(props)
  

 this.state = {network:'',chainId :'',lastBlockNumber:'',
registryName:'',numberOfTotalTokens:'',userAddress:'',userTokensIsPressed:false,tokenIdIsPressed:false
,numberOfTokensOfUser:'',tokenId:'',animalId:'',animalAge:'',animalRace:'',animalOwnerAdress:'',ownerBalance:''}

  }

loadUserAddress = (event)=>{ 
  // Getting the user Address
  this.userAddress=event.target.value  
  console.log(this.userAddress)
  };

  loadTokenId = (event)=>{ 
    // Getting the Token Id
    this.tokenId=event.target.value  

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
  }
  };

  switchTokenIdIsPressed=async()=>{ 
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const erc721Contract= new web3.eth.Contract(ERC721_ABI,ERC721_ADDRESS)
    try{ 
    //Now we will call the method to know number of token of this User   
    const  animalObject= await erc721Contract.methods._animalsById(this.tokenId).call()
    //get the animal owner
    const animalOwnerAdress= await erc721Contract.methods._animalToOwner(this.tokenId).call()

    //get balance Of owner 
    const ownerBalance=await erc721Contract.methods.balanceOf(animalOwnerAdress).call()
  //  console.log(animalOwnerAdress)
    //send to function that will show characteristics 
  //  console.log(animalObject)  
      this.setState({animalOwnerAdress}) 
      this.setState({ownerBalance})
      this.setState({tokenIdIsPressed:true}) 
      this.setState({animalId:animalObject['id']})
      this.setState({animalAge:animalObject['age']})   
      this.setState({animalRace:animalObject['race']}) 
    }
    catch{
      this.setState({tokenIdIsPressed:false}) 
      alert("please Verify that Id is correct")
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

  renderAnimalCharac(props){
    if (!props.tokenIdIsPressed) {
      return null; 
    }  
    let animalAge;
    let animalRace;
    switch(true) {
      case props.animalRace==0:
        animalRace="Cow"
        break;
      case props.animalRace==1:
        animalRace="Horse"
        break;
      case props.animalRace==2:
        animalRace="Chicken"
        break;
        case props.animalRace==3:
        animalRace="Pig"
        break;
      default:
    }

   switch(true) {
      case props.animalAge==0:
        animalAge="Young"
        break;
      case props.animalAge==1:
        animalAge="Adult"
        break;
      case props.animalAge==2:
        animalAge="Old"
        break;
      default:
    }
    return (
      <div>
       <p> Animal Id is {props.animalId}</p> 
       <p> this animal is  {animalAge}</p> 
       <p> Animal Race is {animalRace}</p>
       <p>The owner of this animal is {props.animalOwnerAdress}</p> 
       <p>The balance of this owner is {props.ownerBalance}</p>
      
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

    
<p><input type='text' placeholder='Token Id' name='TokenId' onChange={this.loadTokenId}/>
<button onClick={this.switchTokenIdIsPressed}>Show Animal characteristics</button></p>
<this.renderAnimalCharac   tokenIdIsPressed={this.state.tokenIdIsPressed} animalId={this.state.animalId} 
animalAge={this.state.animalAge} animalAge={this.state.animalAge} 
animalRace={this.state.animalRace} animalOwnerAdress={this.state.animalOwnerAdress} ownerBalance={this.state.ownerBalance} />
<Link to={"/"}>Click here to return to HomePage</Link>
  </div>
  );
  }}


 
  

export default TokensHandler;