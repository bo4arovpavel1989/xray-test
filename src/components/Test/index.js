import React from 'react'
import { withRouter } from 'react-router-dom'
import Slide from './Slide'
import User from './User'
import { getData } from './../../actions'

class Test extends React.Component {
  constructor () {
    super()

    this.state = {
      loading: false,
      testStarted: false,
      user: '',
      settings: {},
      tests: [],
      currentTest: '',
      currentQuestion: -1,
      questions: []
    }

    this.setSettings = this.setSettings.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    this.getSettings();
    this.getTests();
  }

  handleChange (e) {
    const data = {};

    data[e.target.id] = e.target.value;

    this.setState(data);
  }

  handleSubmit (e) {
    e.preventDefault()

    this.chooseTest()
  }

  getSettings () {
    return getData('settings')
            .then(settings => this.setSettings(settings))
            .catch(err => this.setState({ err: true }))
  }

  getTests () {
    return getData('tests')
            .then(tests => this.setState({ tests }))
            .catch(err => this.setState({ err: true }))
  }

  setSettings (settingsArray) {
    const settingsObject = {};

    settingsArray.forEach(tune => {
      settingsObject[tune.name] = tune.value;
    })

    this.setState({ settings: settingsObject })
  }

  chooseTest () {
    const { tests } = this.state;
    const howMany = tests.length;
    const variant = Math.floor(Math.random() * howMany);

    this.getQuestions(variant);
  }

  getQuestions (variant) {
    return getData(`questions/${variant}`)
            .then(questions => this.setState({ questions }, this.setCurrentQuestion))
            .catch(err => window.alert(err))
  }

  setCurrentQuestion () {
    console.log(this.state)
    this.setState({ testStarted: true })
  }

  render () {
    const { testStarted } = this.state;

    return (
      <div className='container'>
        { testStarted ?
          <div className='testArea'>
            <Slide
              currentQuestion = { this.currentQuestion }
            />
          </div> :
          <div className='userArea'>
            <User
              handleChange = { this.handleChange }
              handleSubmit = { this.handleSubmit }
            />
          </div>
        }
      </div>
    )
  }
}

export default withRouter(Test)
