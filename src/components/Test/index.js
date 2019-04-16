import React from 'react'
import { withRouter } from 'react-router-dom'
import Slide from './Slide'
import User from './User'
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
      currentTest: '',
      currentQuestion: -1,
      questions: [],
      total: 100
    }

    this.setSettings = this.setSettings.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.sendResult = this.sendResult.bind(this);

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
    return getData(`questions/${chosenTest}`)
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
    let { total } = this.state;

    total = total - result;
    this.setState({ total });
  }

  render () {
    const { testStarted, settings, currentQuestion, questions, total, testFinished } = this.state;
    const { drawer } = this.props;
    const { errorThreshold } = settings;

    return (
      <div className='container'>
        { testStarted ?
            (<div className='testArea'>
              <div>
                Итого: { total }%
              </div>
              <Slide
                prepareCanvas = { drawer.prepareCanvas }
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
