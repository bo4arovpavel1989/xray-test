import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Menu.sass'

class Menu extends React.Component {
  render () {
    return (
      <div className='container'>
        <div className='menuItem'>
          <Link className='menuButton' to='/test'>Начать тест</Link>
        </div>
        <div className='menuItem'>
          <Link className='menuButton' to='/admin'>Настройки</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Menu)
