import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getData } from './../../actions'

class Admin extends React.Component {
  constructor () {
    super()

    this.state = {
      tests: [],
      err: false
    }
  }

  componentDidMount () {
    this.getTests()
  }

  getTests () {
    return getData('tests')
            .then(tests => this.setState({ tests }))
            .catch(err => this.setState({ err: true }))
  }

  render () {
    const { tests } = this.state;

    return (
      <div>
        <div className='newTest'>
          <div className='menuItem'>
            <Link className='menuButton' to='/create/test'>Создать новый тест</Link>
          </div>
        </div>
        <div className='oldTest'>
          <ul>
            {
              tests.map(test => {
                return <li>test.name &emsp; <a>Изменить</a> &emsp;<a>Удалить</a></li>
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default withRouter(Admin)
