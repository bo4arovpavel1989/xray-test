import React from 'react'
import { withRouter } from 'react-router-dom'

class Forbidden extends React.Component {
  render () {
    return (
      <div>
        <h1>403 Нет доступа</h1>
        <h3>Залогиньтесь для продолжения</h3>
      </div>
    )
  }
}

export default withRouter(Forbidden)
