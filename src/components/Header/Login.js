import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Header.sass'

const Login = props => {
  const { login, authFail, isLogging } = props

  return (
      <form className='loginForm' onSubmit = { login }>
        {
          authFail ?
            <div className='authFailMessage'>Неверное имя пользователя или пароль!</div>
          :
            ''
        }
        <span>
          <input type='login' name='login' placeholder='login'/>
          <input type='password' name='password' placeholder='password'/>
        </span>
        <span>
          <input disabled = { isLogging } type='submit' value='Войти'/>
        </span>
      </form>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}

export default withRouter(Login)
