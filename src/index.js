import React from 'react';
import ReactDom from 'react-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Test from './components/Test';
import Admin from './components/Admin';
import Forbidden from './components/Forbidden';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './main.sass';
import {postData} from './actions';


class App extends React.Component {
  constructor(){
    super();

    this.state={
      isAdmin: false
    };
  }

  login(e){
    e.preventDefault();

    const data = {
      login: e.target.login.value,
      password: e.target.password.value
    };

    console.log(data);
    
    postData('login', data)
      .then(rep=>console.log(rep))
      .catch(err=>console.log(err));
  }

  logoff(){
    this.setState({isAdmin: false})
  }

  render(){
    const {isAdmin} = this.state;

    return (
      <BrowserRouter>
        <div>
          <Header
           isAdmin={isAdmin}
           login={this.login}
           logoff={this.logoff}
           />
          <Switch>
            <Route path='/' render={Menu} exact/>
            <Route path='/test' render={Test}/>
            <Route path='/admin' render={isAdmin ? Admin : Forbidden}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDom.render(
  <App/>,
  document.getElementById('root')
);
