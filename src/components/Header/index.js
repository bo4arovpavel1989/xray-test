import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Login from './Login'
import './Header.sass'

const Header = props => {
  const { isAdmin, authFail, logoff, login } = props

  return (
    <div className='headerArea'>
      <Link className='header' to='/'>
        <h1>XRay-test</h1>
      </Link>
      {
        isAdmin
          ? <div className='loginArea'>
            Вход выполнен
            <a className='logoff' onClick={logoff}>
              Выйти
            </a>
          </div>
          : <Login login={login} authFail={authFail}/>
        }
    </div>
  )
}

Header.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  logoff: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
}

export default withRouter(Header)
