import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './User.sass'

const User = props => {
  const { handleSubmit, handleChange } = props;

  return (
      <div>
        <div className='paranja'>
        </div>
        <div className='userLoginArea'>
          <form className = 'userLogin' onSubmit = { handleSubmit }>
            <div>
              <span>
                <label>
                  Ваше имя: &emsp;
                  <input type='text' id='user' onChange = { handleChange } required/>
                </label>
              </span>
              <span>
                <input type='submit' value='Начать тест'/>
              </span>
            </div>
          </form>
        </div>
      </div>
  )
}

User.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default withRouter(User)
export { User }
