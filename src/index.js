import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header'
import Menu from './components/Menu'
import Test from './components/Test'
import Admin from './components/Admin'
import Forbidden from './components/Forbidden'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './main.sass'
import { postData } from './actions'
import { setToken } from './helpers'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      isAdmin: false,
      authFail: false,
      token: undefined
    }

    this.login = this.login.bind(this)
    this.logoff = this.logoff.bind(this)
    this.handleAuth = this.handleAuth.bind(this)
  }

  login (e) {
    e.preventDefault()

    const data = {
      login: e.target.login.value,
      password: e.target.password.value
    }

    postData('login', data)
      .then(rep => this.handleAuth(rep))
      .catch(err => console.log(err))
  }

  handleAuth (rep) {
    this.setState({ isAdmin: rep.auth, authFail: !rep.auth, token: rep.token })

    setToken(rep.token)
  }

  logoff () {
    this.setState({
      isAdmin: false,
      token: undefined
     })

     setToken(null)
  }

  render () {
    const { isAdmin, authFail } = this.state

    return (
      <BrowserRouter>
        <div>
          <Header
           isAdmin={isAdmin}
           authFail={authFail}
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
    )
  }
}

ReactDom.render(
  <App/>,
  document.getElementById('root')
)
