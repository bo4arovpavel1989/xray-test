import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getData, deleteData, postData } from './../../actions'

class Admin extends React.Component {
  constructor () {
    super()

    this.state = {
      questions: [],
      settings: [],
      tests: [],
      err: false
    }

    this.deleteObj = this.deleteObj.bind(this);
    this.refreshTest = this.refreshTest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    this.getSettings();
    this.getTests();
    this.getQuestions();
  }

  getSettings () {
    return getData('settings')
            .then(settings => this.setState({ settings }))
            .catch(err => this.setState({ err: true }))
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

  getData () {
    this.getTests();
    this.getQuestions();
  }

  deleteObj (obj, name) {
    let conf = window.confirm('Вы уверены?');

    if (conf) {
      return deleteData(`deleteobj/${obj}/${name}`)
              .then(rep => this.getData())
              .catch(err => this.setState({ err: true }))
    }
  }

  refreshTest (name) {
    return postData('test', { name })
            .then(rep => window.alert('Успешно обновлено!'))
            .catch(err => window.alert(err))
  }

  handleChange (e) {
    const { value, type } = e.target;
    const { description } = e.target.dataset;
    const name = e.target.id;
    const { settings } = this.state;

    settings.forEach((tune, i) => {
      if (name === tune.name) settings[i] = { name, value, type, description }
    })

    this.setState({ settings })
  }

  handleSubmit (e) {
    e.preventDefault();

    const { settings } = this.state;

    return postData('settings', { settings })
            .then(rep => window.alert('Успешно сохранено!'))
            .catch(err => window.alert(err))
  }

  render () {
    const { settings, tests, questions } = this.state;

    return (
      <div>
        <div className='newTest'>
          <div className='menuItem'>
            <Link className='menuButton' to='/create/test'>Создать новый тест</Link>
            <Link className='menuButton' to='/create/question'>Создать новый вопрос</Link>
          </div>
        </div>
          <h2>Настройки</h2>
          <div className='formArea'>
            <form onSubmit={this.handleSubmit}>
              {
                settings.map(tune => {
                  return <div key={tune._id}>
                    <label>
                      {tune.description}: &emsp;
                      <input
                        id={tune.name}
                        data-description={tune.description}
                        type={tune.type}
                        value={tune.value}
                        onChange={this.handleChange}
                      />
                    </label>
                  </div>
                })
              }
              <div>
                <input type='submit' value='Сохранить'/>
              </div>
            </form>
          </div>
        <div>
        </div>
        <div className='oldTest'>
          <h2>Тесты</h2>
          <ul>
            {
              tests.map(test => {
                return <li key={test._id}>{test.name} &emsp;
                <a onClick={() => this.refreshTest(test.name)}>Обновить</a> &emsp;
                <a className='danger' onClick={() => this.deleteObj('Test', test.name)}>Удалить</a>
                </li>
              })
            }
          </ul>
        </div>
        <div className='oldQuestions'>
          <h2>Вопросы</h2>
          <ul>
            {
              questions.map(q => {
                return <li key={q._id}>{q.name} &emsp;
                  <Link to={`/create/question?question=${q.name}`}>Изменить</Link>&emsp;
                  <a className='danger' onClick={() => this.deleteObj('Question', q.name)}>Удалить</a>
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
