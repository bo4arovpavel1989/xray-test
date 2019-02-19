import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getData, deleteData } from './../../actions'

class Admin extends React.Component {
  constructor () {
    super()

    this.state = {
      questions: [],
      tests: [],
      err: false
    }

    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  componentDidMount () {
    this.getTests();
    this.getQuestions();
  }

  getTests () {
    return getData('tests')
            .then(tests => this.setState({ tests }))
            .catch(err => this.setState({ err: true }))
  }

  getQuestions () {
    return getData('questions')
            .then(questions => this.setState({ questions }))
            .catch(err => this.setState({ err: true }))
  }

  deleteQuestion (name) {
    let conf = window.confirm('Вы уверены?');

    if (conf) {
      return deleteData(`question/${name}`)
              .then(rep => this.getQuestions())
              .catch(err => this.setState({ err: true }))
    }
  }

  render () {
    const { tests, questions } = this.state;

    return (
      <div>
        <div className='newTest'>
          <div className='menuItem'>
            <Link className='menuButton' to='/create/test'>Создать новый тест</Link>
            <Link className='menuButton' to='/create/question'>Создать новый вопрос</Link>
          </div>
        </div>
        <div className='oldTest'>
          <h2>Тесты</h2>
          <ul>
            {
              tests.map(test => {
                return <li>test.name &emsp; <a>Изменить</a> &emsp;<a>Удалить</a></li>
              })
            }
          </ul>
        </div>
        <div className='oldQuestions'>
          <h2>Вопросы</h2>
          <ul>
            {
              questions.map(q => {
                return <li>{q.name} &emsp;
                  <Link to={`/create/question?question=${q.name}`}>Изменить</Link>
                  &emsp;<a className='danger' onClick={() => this.deleteQuestion(q.name)}>Удалить</a>
                </li>
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default withRouter(Admin)
