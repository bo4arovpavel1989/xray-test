import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { getData, deleteData, postData, postFile } from './../../actions'

class Admin extends React.Component {
  constructor () {
    super()

    this.state = {
      questions: [],
      settings: [],
      tests: [],
      submitting: false,
      err: false
    }

    this.deleteObj = this.deleteObj.bind(this);
    this.refreshTest = this.refreshTest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveDb = this.saveDb.bind(this);
    this.handleDbRecovery = this.handleDbRecovery.bind(this);
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

  getTestData () {
    this.getTests();
    this.getQuestions();
  }

  deleteObj (obj, name) {
    let conf = window.confirm('Вы уверены?');

    if (conf) {
      return deleteData(`deleteobj/${obj}/${name}`)
              .then(rep => this.getTestData())
              .catch(err => this.setState({ err: true }))
    }
  }

  refreshTest (name) {
    return postData('test', { name })
            .then(rep => window.alert('Успешно обновлено!'))
            .catch(window.alert)
  }

  handleChange (e) {
    let { value, type } = e.target;
    const { description } = e.target.dataset;
    const name = e.target.id;
    const { settings } = this.state;

    value = this.handleTypes(value, type);

    settings.forEach((tune, i) => {
      if (name === tune.name) settings[i] = { name, value, type, description }
    })

    this.setState({ settings })
  }

  handleTypes (val, type) {
    const typesMap = {
      number: () => Number(val)
    }

    if (typesMap[type]) return typesMap[type](val)
    else return val
  }

  saveDb () {
    this.setState({ submitting: true })

    return getData('savedb')
            .then(() => window.alert('Успешно сохранено!'))
            .catch(window.alert)
            .finally(() => this.setState({ submitting: false }))
  }

  handleDbRecovery (e) {
    e.preventDefault();

    let sure = window.confirm('Вы уверены? Текущая база данных будет перезаписана!')

    if (sure) {
      this.setState({ submitting: true })

      const questions = document.querySelector('input[type="file"][name="questions"]');
      const tests = document.querySelector('input[type="file"][name="tests"]');
      const data = new FormData();

      data.append('questions', questions.files[0]);
      data.append('tests', tests.files[0]);

      return postFile('loaddb', data)
              .then(() => {
                window.alert('Успешно восстановлено!');
                this.getTestData();
              })
              .catch(window.alert)
              .finally(() => this.setState({ submitting: false }))
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.setState({ submitting: true })

    const { settings } = this.state;

    return postData('settings', { settings })
            .then(rep => window.alert('Успешно сохранено!'))
            .catch(window.alert)
            .finally(() => this.setState({ submitting: false }))
  }

  render () {
    const { settings, tests, questions, submitting } = this.state;

    return (
      <div className='container'>
        <div className='newTest'>
          <div className='menuItem'>
            <Link className='menuButton' to='/create/test'>Создать новый тест</Link>
            <Link className='menuButton' to='/create/question'>Создать новый вопрос</Link>
          </div>
          <div>
            <button disabled={submitting} className='menuButton small' onClick={this.saveDb}>Сохранить базу</button>
            <form onSubmit={this.handleDbRecovery}>
              <label> Выберите JSON файл с вопросами &emsp;
                <input type='file' name='questions' accept='.json' required/>
              </label><br/>
              <label> Выберите JSON файл с тестами &emsp;
                <input type='file' name='tests' accept='.json' required/>
              </label><br/>
              <input disabled={submitting} type='submit' value='Восстановить базу'/>
            </form>
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
                <input disabled={submitting} type='submit' value='Сохранить'/>
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
