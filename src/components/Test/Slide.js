import React from 'react'
import { withRouter } from 'react-router-dom'
import './Slide.sass'
import Drawer from '../Drawer'

class Slide extends React.Component {
  constructor () {
    super();

    this.state = {
      settings: {},
      question: {},
      warningShowed: false,
      answered: false,
      result: 0
    }

    this.setClear = this.setClear.bind(this);
    this.getResult = this.getResult.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.clearTimers = this.clearTimers.bind(this);
    this.setTimers = this.setTimers.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.prepareCanvas = this.prepareCanvas.bind(this);
    this.setNewQuestion = this.setNewQuestion.bind(this);
  }

  componentDidMount () {
    const canvasDraw = '#canvasDrawArea';
    const canvasBackground = '#canvasBackground';
    const { settings, question } = this.props;

    this.drawer = new Drawer(document.querySelector(canvasDraw));
    this.setState({ settings, question, canvasBackground, canvasDraw }, this.setNewQuestion);
  }

  componentDidUpdate (prevProps, prevState) {
    const prevQuestion = prevState.question;
    const newQuestion = this.state.question;

    if (prevQuestion && newQuestion && newQuestion.name !== prevQuestion.name) {
      this.setNewQuestion()
    }
  }

  componentWillUnmount () {
    this.clearTimers();
    this.removeClickListener();
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const prevQuestion = prevState.question;
    const newQuestion = nextProps.question;

    if (newQuestion && prevQuestion && prevQuestion.name !== newQuestion.name) {
      return {
        question: newQuestion
      }
    }

    return null;
  }

  setNewQuestion (question) {
    this.setState({ answered: false, warningShowed: false, result: 0 }, this.prepareCanvas);
  }

  removeClickListener () {
    const drawLayer = this.getCanvasDraw();

    drawLayer.removeEventListener('click', this.handleCanvasClick)
  }

  /**
   * Method sets canvas width and heigth, add background image
   * and inits drawing dangerzone rectangels
   * @returns {void}
   */
  prepareCanvas () {
    this.setCanvasDimensions();

    const background = new Image();

    background.src = this.state.question.imgPath;
    background.onload = () => {
      this.setClickListener();
      this.setCanvasBackground(background);
      this.setTimers();
    }
  }

  /**
   * Method set canvas width and heigth - both for background and draw layers
   * @returns {void}
   */
  setCanvasDimensions () {
    const { width, height } = this.state.question.dimensions;

    this.getCanvasDraw().width = width;
    this.getCanvasDraw().height = height;
    this.getCanvasBackground().width = width;
    this.getCanvasBackground().height = height;
  }

  /**
   * Method calls background layer canvas to draw background
   * @returns {Function} - drawImage method of canvas
   */
  setCanvasBackground (bg) {
    return this.getCanvasBackground().getContext('2d').drawImage(bg, 0, 0)
  }

  /**
   * Method draws old rectangles got from API if any
   * and starts to listen to new user draw
   * @returns {Function} - draw method of this.draw
   */
  drawDangerZone (c) {
    const { dangerZones } = this.state.question;
    if (dangerZones.length > 0) return this.drawer.drawOldZones(dangerZones);

    return false;
  }

  /**
   * Get selector for canvas draw layer
   * @returns {Object} - DOM selector
   */
  getCanvasDraw () {
    return document.querySelector(this.state.canvasDraw)
  }

  /**
   * Get selector for canvas background layer
   * @returns {Object} - DOM selector
   */
  getCanvasBackground () {
    return document.querySelector(this.state.canvasBackground)
  }

  setClear () {
    const { isDanger } = this.state.question;
    const { redError } = this.state.settings;

    if (isDanger === '1') this.setState({ result: redError }, this.finishQuestion)
    else this.finishQuestion();
  }

  setClickListener () {
    const drawLayer = this.getCanvasDraw();

    drawLayer.addEventListener('click', this.handleCanvasClick)
  }

  setTimers () {
    const { timeWarning, time } = this.state.settings;

    this.warningTimer = setTimeout(this.showWarning, timeWarning * 1000)
    this.finishTimer = setTimeout(this.handleTimer, time * 1000)
  }

  clearTimers () {
    clearTimeout(this.warningTimer)
    clearTimeout(this.finishTimer)
  }

  handleTimer () {
    const { answered } = this.state;
    const { redError, yellowError } = this.state.settings;
    const { isDanger } = this.state.question;

    if (!answered) {
      let result;

      result = isDanger === '1' ? redError : yellowError;
      return this.setState({ answered: true, result }, this.finishQuestion)
    }

    return false;
  }

  showWarning () {
    return this.setState({ warningShowed: true })
  }

  handleCanvasClick (e) {
    const { dangerZones } = this.state.question;
    const { yellowError } = this.state.settings;

    if (dangerZones.length === 0) {
      return this.setState({ result: yellowError }, this.finishQuestion)
    }

    const x = e.offsetX;
    const y = e.offsetY;

    return this.checkIfClickInDangerZone(x, y)
  }

  checkIfClickInDangerZone (x, y) {
    const { dangerZones } = this.state.question;
    const { redError } = this.state.settings;
    const isRight = dangerZones.some(zone =>
      x > zone[0] && y > zone[1] && x < zone[2] && y < zone[3]
    );

    if (isRight) this.finishQuestion();
    else this.setState({ result: redError }, this.finishQuestion)
  }

  finishQuestion () {
    this.clearTimers();
    this.removeClickListener();
    this.drawDangerZone();
    this.setState({ answered: true });
    this.showResult();
  }

  showResult () {
    const { result } = this.state;
    const { sendResult } = this.props;

    return sendResult(result);
  }

  getResult () {
    const { nextQuestion } = this.props;

    return nextQuestion();
  }

  render () {
    const { answered, question, warningShowed, result } = this.state;
    const { yellowError } = this.state.settings;

    return (
      <div>
        <div>
          Вопрос { question.name}
        </div>
        <div className='controls'>
          <button disabled = { answered } onClick= { this.setClear } >Чисто!</button>
          <button disabled = { !answered } onClick = { this.getResult }>Далее</button>
        {
          warningShowed ?
          <span>Время истекает!</span> :
          ''
        }
        {
          answered ?
          <span
            className = { result === 0 ? 'greenMark' : result === yellowError ? 'yellowError' : 'redError'}
          ></span> :
          ''
        }
        </div>
        <div className='canvasArea'>
          <canvas id="canvasBackground"></canvas>
          <canvas id="canvasDrawArea"></canvas>
        </div>
      </div>
    )
  }
}

export default withRouter(Slide)