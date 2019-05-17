import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './History.sass'
import Drawer from '../Drawer'

class History extends React.PureComponent {
  constructor (props) {
    super(props);

    const { testHistory, settings } = this.props;
    const canvasDraw = '#canvasDrawArea';
    const canvasBackground = '#canvasBackground';

    this.state = {
      settings,
      testHistory,
      answer: {},
      currentQuestion: 0,
      canvasBackground,
      canvasDraw
    }

    this.closeHistory = this.closeHistory.bind(this);
    this.getNext = this.getNext.bind(this);
    this.getPrev = this.getPrev.bind(this);
  }

  componentDidMount () {
    const { canvasDraw } = this.state;

    this.drawer = this.props.drawer || new Drawer(document.querySelector(canvasDraw));
    this.prepareCanvas = this.props.prepareCanvas || this.prepareCanvas;

    this.setCurrentQuestion();
  }

  setCurrentQuestion () {
    const index = this.state.currentQuestion;
    const answer = this.state.testHistory[index];

    this.setState({ answer }, this.prepareCanvas);
  }

  /**
   * Method sets canvas width and heigth, add background image
   * and inits drawing dangerzone rectangels
   * @returns {void}
   */
  prepareCanvas () {
    this.setCanvasDimensions();

    const background = new Image();

    background.src = this.state.answer.question.imgPath;
    background.onload = () => {
      this.setCanvasBackground(background);
      this.placeUserClick();
    }
  }

  /**
   * Method calls background layer canvas to draw background
   * @returns {Function} - drawImage method of canvas
   */
  setCanvasBackground (bg) {
    return this.getCanvasBackground().getContext('2d').drawImage(bg, 0, 0)
  }

  placeUserClick () {
    const { click } = this.state.answer;

    if (click) this.drawer.placeUserClick(click)
  }

  /**
   * Method set canvas width and heigth - both for background and draw layers
   * @returns {void}
   */
  setCanvasDimensions () {
    const { width, height } = this.state.answer.question.dimensions;

    this.getCanvasDraw().width = width;
    this.getCanvasDraw().height = height;
    this.getCanvasBackground().width = width;
    this.getCanvasBackground().height = height;
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

  closeHistory () {
    const { closeHistory } = this.props;

    return closeHistory();
  }

  getPrev () {
    let { currentQuestion } = this.state;

    if (currentQuestion === 0) return false;

    this.setState({ currentQuestion: currentQuestion - 1 }, this.setCurrentQuestion)
  }

  getNext () {
    let { currentQuestion, testHistory } = this.state;

    if (currentQuestion === testHistory.length - 1) return false;

    this.setState({ currentQuestion: currentQuestion + 1 }, this.setCurrentQuestion)
  }

  render () {
    const { result, comment, click } = this.state.answer;
    const { yellowError } = this.state.settings;

    return (
      <div>
        <a onClick= { this.closeHistory }>закрыть</a>
        <div>
          <span onClick = { this.getPrev } className='prev nav'></span>
          <span onClick = { this.getNext } className='next nav'></span>
        </div>
        <div className='canvasArea'>
          <div className='actionComment_container speech'>
            <div id='actionComment' className = { result === 0 ? 'green' : result === yellowError ? 'yellow' : 'red'} >{ comment }</div>
          </div>
          <div className='markIcon_cotainer'>
            <span
              id='markIcon'
              className = { result === 0 ? 'greenMark' : result === yellowError ? 'yellowError' : 'redError'}
            ></span>
          </div>
          {
            click ?
              ''
            :
            <div className='clearButton_container'>
              <button id='clearButton' className='highlighted'>&#9745;</button>
            </div>
          }
          <div className='canvas_container'>
            <canvas id="canvasBackground"></canvas>
          </div>
          <div className='canvas_container'>
            <canvas id="canvasDrawArea"></canvas>
          </div>
        </div>
      </div>
    )
  }
}

History.propTypes = {
  testHistory: PropTypes.array.isRequired,
  closeHistory: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
}

export default withRouter(History)
export { History }
