import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header'
import Menu from './components/Menu'
import Test from './components/Test'
import Admin from './components/Admin'
import Forbidden from './components/Forbidden'
import CreateTest from './components/CreateTest'
import CreateQuestion from './components/CreateQuestion'
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
      .then(rep => this.handleAuth(rep))
      .catch(err => console.log(err))
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

ReactDom.render(
  <App/>,
  document.body
)

export default App;
