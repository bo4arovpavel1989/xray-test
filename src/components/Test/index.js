import React from 'react'
import { withRouter } from 'react-router-dom'
import Slide from './Slide'
import User from './User'
import History from './History'
import './Test.sass'
import { getData } from './../../actions'

class Test extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      testStarted: false,
      testFinished: false,
      user: '',
      settings: {},
      tests: [],
      currentQuestion: -1,
      questions: [],
      testHistory: [],
      historyMode: false,
      total: 100
    }

    this.setSettings = this.setSettings.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.sendResult = this.sendResult.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.closeHistory = this.closeHistory.bind(this);
    this.finishTest = this.finishTest.bind(this);

    this.getData = this.props.getData || getData;
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
    return this.getData('settings')
               .then(settings => this.setSettings(settings))
               .catch(err => this.setState({ err: true }))
  }

  getTests () {
    return this.getData('tests')
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
    const chosenTest = tests[variant].name;

    this.getQuestions(chosenTest);
  }

  getQuestions (chosenTest) {
    return this.getData(`questions/${chosenTest}`)
               .then(questions => this.setState({ questions }, this.setCurrentQuestion))
               .catch(err => window.alert(err))
  }

  setCurrentQuestion () {
    const currentQuestion = this.state.currentQuestion + 1;
    const totalQuestions = this.state.questions.length;

    if (currentQuestion < totalQuestions) this.setState({ testStarted: true, currentQuestion })
    else this.setState({ testFinished: true, testStarted: false })
  }

  nextQuestion () {
    return this.setCurrentQuestion();
  }

  sendResult (result) {
    let { total, testHistory } = this.state;

    total = total - result.result;
    testHistory.push(result);
    this.setState({ total, testHistory });
  }

  showHistory () {
    this.setState({ historyMode: true })
  }

  closeHistory () {
    this.setState({ historyMode: false })
  }

  finishTest () {
    this.setState({ testFinished: true, testStarted: false })
  }

  render () {
    const {
      testStarted,
      settings,
      currentQuestion,
      questions,
      total,
      testFinished,
      historyMode,
      testHistory } = this.state;
    const { drawer, prepareCanvas } = this.props;
    const { errorThreshold } = settings;

    return (
      <div className='container'>
      <a onClick= { this.finishTest }>закончить тест</a>
        {
          historyMode ?
            <History
              testHistory = { testHistory }
              closeHistory = { this.closeHistory }
              settings = { settings }
            />
          :
          testStarted ?
            (<div className='testArea'>
              <div>
                Итого: { total }%
              </div>
              <Slide
                prepareCanvas = { prepareCanvas }
                drawer = { drawer }
                question = { questions[currentQuestion] }
                settings = { settings }
                sendResult = { this.sendResult }
                nextQuestion = { this.nextQuestion }
              />
            </div>)
          :
          testFinished ?
            (<div className='resultArea'>
              <h2>
                Ваш результат:
                <span
                className = { total < errorThreshold ? 'fail' : total < 100 ? 'enought' : 'perfect'}
                > { total }%</span>
              </h2>
              <a onClick= { this.showHistory }>Показать ответы</a>
            </div>)
          :
            (<div className='userArea'>
              <User
                handleChange = { this.handleChange }
                handleSubmit = { this.handleSubmit }
              />
            </div>)
        }
      </div>
    )
  }
}

export default withRouter(Test)
export { Test }
