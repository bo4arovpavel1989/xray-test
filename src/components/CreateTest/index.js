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
    console.log(this.state)
    return postData('test', { name })
            .then(rep => {
              alert('Успешно сохранено!');
              this.setState({ loading: false })
            })
            .catch(err => {
              alert(err);
              this.setState({ loading: false })
            })
  }

  handleChange (e) {
    const data = {};

    data[e.target.id] = e.target.value;

    this.setState(data);
  }

  render () {
    const { loading } = this.state;

    return (
      <div>
        <div className='formArea'>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Номер теста: &emsp;<input id='name' onChange={this.handleChange} type='number' min='1'/>
              </label>
            </div>
            <div>
              <input disabled={loading} type='submit' value='Создать'/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateTest)
