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
      answered: false,
      result: 0
    }

    this.setClear = this.setClear.bind(this);
    this.getResult = this.getResult.bind(this);
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
    this.setState({ answered: false, result: 0 }, this.prepareCanvas);
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
      this.setCanvasBackground(background)
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
    return this.drawer.drawOldZones(dangerZones);
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

  finishQuestion () {
    if (this.state.result > 0) this.drawDangerZone()
    this.setState({ answered: true });
  }

  getResult () {
    const { result } = this.state;
    const { nextQuestion } = this.props;
    return nextQuestion(result);
  }

  render () {
    const { answered, question } = this.state;

    return (
      <div>
        <div>
          Вопрос { question.name}
        </div>
        <div className='controls'>
          <button onClick= { this.setClear } >Чисто!</button>
          <button disabled = { !answered } onClick = { this.getResult }>Далее</button>
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
