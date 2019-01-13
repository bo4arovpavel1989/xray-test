import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Header.sass'

const Login = props => {
  const { login } = props

  return (
      <form className='loginForm' onSubmit={login}>
        <input type='login' name='login' placeholder='login'/>
        <input type='password' name='password' placeholder='password'/>
        <input type='submit' value='Войти'/>
      </form>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}

export default withRouter(Login)
