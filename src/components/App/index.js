import React from 'react'
import Header from '../Header'
import Menu from '../Menu'
import Test from '../Test'
import Admin from '../Admin'
import Forbidden from '../Forbidden'
import CreateTest from '../CreateTest'
import CreateQuestion from '../CreateQuestion'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import '../../main.sass'
import { postData } from '../../actions.js'
import { setToken } from '../../helpers'

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      isAdmin: false,
      authFail: false,
      isLogging: false,
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

    this.setState({ isLogging: true })

    postData('login', data)
      .then(this.handleAuth)
      .catch(console.log)
      .finally(() => this.setState({ isLogging: false }))
  }

  handleAuth (rep) {
    if (rep.auth) setToken(rep.token)
    this.setState({ isAdmin: rep.auth, authFail: !rep.auth, token: rep.token })
  }

  logoff () {
    this.setState({
      isAdmin: false,
      token: undefined
     })

     setToken(null)
  }

  render () {
    const { isAdmin, authFail, isLogging } = this.state

    return (
      <BrowserRouter>
        <div>
          <Header
           isAdmin={isAdmin}
           authFail={authFail}
           isLogging = {isLogging}
           login={this.login}
           logoff={this.logoff}
           />
          <Switch>
            <Route path='/' render={Menu} exact/>
            <Route path='/test' render={Test}/>
            <Route path='/admin' render={isAdmin ? Admin : Forbidden}/>
            <Route path='/create/test' render={isAdmin ? CreateTest : Forbidden}/>
            <Route path='/create/question' render={isAdmin ? CreateQuestion : Forbidden}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
