import React from 'react';
import ReactDom from 'react-dom';
import Header from './components/Header';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


class App extends React.Component {

  constructor(){
    super();

    this.state={
      isAdmin: false
    };
  }

  render(){
    const {isAdmin} = this.state;

    return (
      <BrowserRouter>
        <Header isAdmin={isAdmin}/>
        <Switch>
          <Route path='/'render={Menu} exact/>
          <Route path='/test' render={Test}/>
          <Route path='/admin' render={isAdmin ? Admin : Forbidden}/>
        </Switch>
      <BrowserRouter/>
    );
  }
}

ReactDom.render(
  <App/>,
  document.getElementById('root')
)
