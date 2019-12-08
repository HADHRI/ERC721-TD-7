import React , {Component} from 'react';
import { Route, BrowserRouter as Router ,Link} from 'react-router-dom'
import Web3 from 'web3';
import ReactDOM from 'react-dom';
import {ERC721_ABI,ERC721_ADDRESS} from './config' 

class BuyTokensHandler extends Component{

   
    loadUserAddress = (event)=>{ 
        // Getting the user Address
        this.userAddress=event.target.value  
        }; 
    loadAnimalRace = (event)=>{ 
// Getting Animal Race
   switch(true) {
    case event.target.value =='Cow':
      this.animalRace=0
      break;
    case event.target.value =='Horse':
      this.animalRace=1
      break;
    case event.target.value =='Chicken':
      this.animalRace=2
      break;
    default:
  }
        }; 

        loadAnimalAge = (event)=>{ 
            // Getting Animal Age
               switch(true) {
                case event.target.value =='Young':
                  this.animalAge=0
                  break;
                case event.target.value =='Adult':
                  this.animalAge=1
                  break;
                case event.target.value =='Old':
                  this.animalAge=2
                  break;
                default:
              }
                    }; 
    
    constructor(props){
    super(props)
    //Default values animal is adult and a horse
    this.state = {userAddress:'',animalRace:1,animalAge:1}
    this.animalRace=1
    this.animalAge=1
    }


    // This method will call declareAnimal methode
    buyAnimal=async()=>{ 


      console.log(window.ethereum)
      let ethereum = window.ethereum;
      await ethereum.enable();
  
    //retreive form values 
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const erc721Contract= new web3.eth.Contract(ERC721_ABI,ERC721_ADDRESS)
  
  // let's declare an Animal ( this methode is payable (0.1ETH))
  console.log(erc721Contract.methods.declareAnimal)
  try{
    let getData = erc721Contract.methods.declareAnimal(this.userAddress,this.animalRace,this.animalAge).encodeABI() 
    console.log(getData) 
     web3.eth.sendTransaction({from:this.userAddress, to:ERC721_ADDRESS,value:"100000000000000000",
     data: getData}); 
  }
  catch{
    alert('Something went wrong , verify info and retry payment')
  }

    };
    
    render(){
    return (
    <div className="container">
<p></p>
<p></p>
<form>
<label>Choose Animal Race</label>
<select onChange={this.loadAnimalRace} >
<option id="cow">Cow</option>
<option  id="horse" selected="selected">Horse</option>
<option id="chicken">Chicken</option>
</select> 
<div>
<p></p>
<label>Choose Animal Age</label>
<select onChange={this.loadAnimalAge}  >
<option id="young">Young</option>
<option  id="adult" selected="selected">Adult</option>
<option id="old">Old</option>
</select> 
</div>
<p></p>
<div>
<label>put here your adress</label>
<input type='text' placeholder='Put here your address' onChange={this.loadUserAddress}/>
</div>
<div>
<p></p>
<label>Choose an image for this animal  </label>
<input type="file" id="file" />

</div>
</form>
<p></p>
<button onClick={this.buyAnimal} >Buy Animal</button>  
<p></p>
<p></p>
<Link to={"/"}>Click here to return to HomePage</Link>
</div> );
    }}
 export default BuyTokensHandler;