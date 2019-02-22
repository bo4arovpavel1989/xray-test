import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Slide.sass'

const User = props => {
  const { handleSubmit, handleChange } = props;

  return (
      <div>
        <form onSubmit = { handleSubmit }>
          <div>
            <label>
              Ваше имя: &emsp;
              <input type='text' id='user' onChange = { handleChange } required/>
            </label>
          </div>
          <div>
            <input type='submit' value='Начать тест'/>
          </div>
        </form>
      </div>
  )
}

User.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default withRouter(User)
