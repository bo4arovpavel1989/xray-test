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
      comment: 'Поздравляем! Правильный ответ.',
      warningShowed: false,
      answered: false,
      result: 0,
      photoShowed: false
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
    this.showPhoto = this.showPhoto.bind(this);
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
    this.setState({ comment: 'Поздравляем! Правильный ответ.', answered: false, warningShowed: false, result: 0 }, this.prepareCanvas);
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

    if (isDanger === '1') this.setState({ comment: 'Ошибка! Опасный предмет есть!', result: redError }, this.finishQuestion)
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
      return this.setState({ comment: 'Время истекло!', answered: true, result }, this.finishQuestion)
    }

    return false;
  }

  showWarning () {
    return this.setState({ warningShowed: true })
  }

  handleCanvasClick (e) {
    const { answered } = this.state;
    const { isDanger } = this.state.question;
    const { yellowError } = this.state.settings;

    if (isDanger === '0' && !answered) {
      return this.setState({ comment: 'Ошибка! Опасных предметов нет!', result: yellowError }, this.finishQuestion)
    }

    return this.checkIfClickInDangerZone(e)
  }

  checkIfClickInDangerZone (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    const { answered } = this.state;
    const { dangerZones } = this.state.question;
    const { redError } = this.state.settings;
    const isRight = dangerZones.some(zone =>
      x > zone[0] && y > zone[1] && x < zone[2] && y < zone[3]
    );

    if (!answered) {
      if (isRight) this.finishQuestion();
      else this.setState({ comment: 'Ошибка! Опасного предмета нет в обозначенной Вами области!', result: redError }, this.finishQuestion)
    }

    if (isRight) this.showPhoto(e);
  }

  showPhoto (e) {
    this.setState({ photoShowed: true }, () => {
      this.handlePhotoPosition(e);
      setTimeout(this.setState.bind(this, { photoShowed: false }), 2000)
    });
  }

  handlePhotoPosition (e) {
    const photo = document.querySelector('.dangerPicture');

    photo.style.top = e.clientY - (photo.naturalHeight / 2) + 'px';
    photo.style.left = e.clientX - (photo.naturalWidth / 2) + 'px';
    setTimeout(() => photo.classList.add('naturalSize'), 20)
  }

  finishQuestion () {
    this.setState({ answered: true });
    this.clearTimers();
    this.drawDangerZone();
    this.showResult();
  }

  showResult () {
    const { result } = this.state;
    const { sendResult } = this.props;

    return sendResult(result);
  }

  getResult () {
    const { nextQuestion } = this.props;

    this.removeClickListener();

    return nextQuestion();
  }

  render () {
    const { answered, question, warningShowed, result, photoShowed, comment } = this.state;
    const { yellowError } = this.state.settings;
    const { dangerPicture } = question;

    return (
      <div>
        <div>
          Вопрос { question.name}
        </div>
        <div className='canvasArea'>
          <div className='actionComment_container speech'>
            {
              answered ?
              <div id='actionComment' className = { result === 0 ? 'green' : result === yellowError ? 'yellow' : 'red'} >{ answered ? comment : '' }</div> :
              ''
            }
          </div>
          <div className='markIcon_cotainer'>
            {
              answered ?
              <span
                id='markIcon'
                className = { result === 0 ? 'greenMark' : result === yellowError ? 'yellowError' : 'redError'}
              ></span> :
              ''
            }
          </div>
          <div className='clearButton_container'>
            <button id='clearButton' disabled = { answered } onClick= { this.setClear } >&#9745;</button>
          </div>
          <div className='canvas_container'>
            <canvas id="canvasBackground"></canvas>
          </div>
          <div className='canvas_container'>
            <canvas id="canvasDrawArea"></canvas>
          </div>
          <div className='timerWarning_container'>
            <span id='timerWarning' className={warningShowed ? '' : 'invisible'}>Внимание! Время истекает!</span>
          </div>
          <div className='forwardButton_container'>
            <button id='forwardButton' disabled = { !answered } onClick = { this.getResult }>&#x25ba;</button>
          </div>
        </div>
        <img className={photoShowed ? 'dangerPicture' : 'hidden'} src= { dangerPicture } alt='Опасный предмет'/>
      </div>
    )
  }
}

export default withRouter(Slide)
