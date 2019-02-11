import React from 'react'
import { withRouter } from 'react-router-dom'
import { getData } from './../../actions'

class CreateTest extends React.Component {
  constructor () {
    super()

    this.state = {
      err: false,
      questions: []
    }
  }

  componentDidMount () {

  }

  getQuestions () {
    getData('questions')
      .then(questions => this.setState({ questions }))
      .catch(err => this.setState({ err: true }))
  }

  render () {
    const { questions } = this.state;

    return (
      <div>
        <div className='formArea'>
          <form>
            <div>
              <label>
                Номер теста: &emsp;<input name='number' type='number' min='1'/>
              </label>
            </div>
            <div>
              <label>
                Вопросы: &emsp;
                <select id='question'>
                  {
                    questions.map(q => {
                      return <option value={q._id}>{q.name}</option>
                    })
                  }
                </select>
                &emsp; <span className='addQuestion'>&#10010;</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateTest)
