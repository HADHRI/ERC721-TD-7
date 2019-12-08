import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TokensHandler from './TokensHandler'
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter  ,Switch} from 'react-router-dom'


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA


const routing = (
    <Switch>
        <Route exact path="/" component={App} /> 
        <Route path="/informations/Tokens-and-users" component={TokensHandler} />
    </Switch>
  );

  const bro=(
    <BrowserRouter forceRefresh={true}>
    {routing}
  </BrowserRouter>
  );
  
  
  ReactDOM.render(bro,document.getElementById('root')); 

serviceWorker.unregister();
