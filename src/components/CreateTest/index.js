import React from 'react'
import { withRouter } from 'react-router-dom'
import { postData } from './../../actions'

class CreateTest extends React.Component {
  constructor () {
    super()

    this.state = {
      err: false,
      loading: false,
      name: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();

    const { name } = this.state;

    this.setState({ loading: true });

    return postData('test', { name })
            .then(rep => window.alert('Успешно сохранено!'))
            .catch(err => window.alert(err))
            .finally(() => this.setState({ loading: false }))
  }

  handleChange (e) {
    const data = {};

    data[e.target.id] = e.target.value;

    this.setState(data);
  }

  render () {
    const { loading } = this.state;

    return (
      <div className='container'>
        <div className='formArea'>
          <form onSubmit={this.handleSubmit}>
            <div>
              <span>
                <label>
                  Номер теста: &emsp;<input id='name' onChange={this.handleChange} type='number' min='1'/>
                </label>
              </span>
              <span>
                <input disabled= { loading } type='submit' value='Создать'/>
              </span>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateTest)
