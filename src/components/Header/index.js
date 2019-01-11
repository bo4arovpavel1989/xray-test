import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

const Header = props=>{
  const {isAdmin, logoff, login} = props;

  return (
    <div className='headerArea'>
      <Link className='header' to='/'>
        <h1>XRay-test</h1>
      </Link>
      {
        isAdmin ?
          <div>
            <a className='logoff' onClick={logoff}>
              Выйти
            </a>
          </div>
          :
          <Login login={login}/>
        }
    <div/>
  )
};

Header.PropTypes = {
  isAdmin: PropTypes.bool.isRequired,
  logoff: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
};

export default withRouter(Header);
