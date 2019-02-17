import React from 'react'
import { withRouter } from 'react-router-dom'
import { postFile } from './../../actions'
import Drawer from '../Drawer'
import './CreateQuestion.sass'

class CreateQuestion extends React.Component {
  constructor () {
    super()

    this.state = {
      loading: false,
      err: false,
      imgLoaded: false,
      imgPath: '',
      dangerZone: [],
      dimensions: { width: 0, height: 0 },
      question: {
        name: '',
        isDanger: '1'
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.uploadPhotos = this.uploadPhotos.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
  }

  componentDidMount () {
    const canvasDraw = '#canvasDrawArea';
    const canvasBackground = '#canvasBackground';
    this.setState({ canvasBackground, canvasDraw })

    this.drawer = new Drawer(document.querySelector(canvasDraw));
  }

  componentWillUnmount () {
    this.drawer.reset();
  }

  getCanvasDraw () {
    return document.querySelector(this.state.canvasDraw)
  }

  getCanvasBackground () {
    return document.querySelector(this.state.canvasBackground)
  }

  uploadPhotos (e) {
    e.preventDefault();

    const data = this.handleFormData();

    this.setState({ loading: true });
    postFile('preupload', data)
      .then(rep => {
        console.log(rep)
        const { name } = this.state.question;

        this.drawer.reset();

        this.setState({
          loading: false,
          imgLoaded: true,
          imgPath: `/images/${name}_slide.${rep.type}`,
          dimensions: rep
        }, () => {
          this.prepareCanvas();
        })
      })
      .catch(err => {
        this.setState({ loading: false })
        alert(err)
      });
  }

  handleFormData () {
    const slide = document.querySelector('input[name="slide"]');
    const photo = document.querySelector('input[name="photo"]');
    const { name, isDanger } = this.state.question;
    const data = new FormData();

    data.append('question', name);
    data.append('slide', slide.files[0]);
    if (isDanger === '1') data.append('photo', photo.files[0]);

    return data;
  }

  handleChange (e) {
    const { question } = this.state;

    question[e.target.id] = e.target.value;
    this.setState({ question });
  }

  prepareCanvas () {
    this.setCanvasDimensions();

    const background = new Image();

    background.src = this.state.imgPath;
    background.onload = () => {
      this.setCanvasBackground(background)
      this.drawDangerZone();
    }
  }

  setCanvasDimensions () {
    const { width, height } = this.state.dimensions;

    this.getCanvasDraw().width = width;
    this.getCanvasDraw().height = height;
    this.getCanvasBackground().width = width;
    this.getCanvasBackground().height = height;
  }

  setCanvasBackground (bg) {
    return this.getCanvasBackground().getContext('2d').drawImage(bg, 0, 0)
  }

  drawDangerZone (c) {
    return this.drawer.start()
  }

  clearCanvas () {
    return this.drawer.clearZones()
  }

  saveQuestion () {
    console.log(this.drawer.getZones())
  }

  render () {
    const { loading, imgLoaded } = this.state;
    const { isDanger } = this.state.question;

    return (
      <div>
        <div className='formArea'>
          <form onSubmit={this.uploadPhotos}>
            <div>
              <label>
                Вопрос: &emsp;
                <input
                  id='name'
                  onChange={this.handleChange}
                  pattern='[0-9]+_[0-9]+'
                  name='name'
                  type='text'
                  placeholder='№ Теста_№ вопроса'
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Загрузите слайд: &emsp;
                <input
                  name='slide'
                  type='file'
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Багаж опасен? &emsp;
                <select id='isDanger' onChange={this.handleChange} defaultValue='1'>
                  <option value='1'>Да</option>
                  <option value='0'>нет</option>
                </select>
              </label>
            </div>
            {
              isDanger === '1' ?
              <div>
                <label>
                  Загрузите фото: &emsp;
                  <input
                    name='photo'
                    type='file'
                    required
                  />
                </label>
              </div> :
              <span></span>
            }
            <div>
              <input disabled={loading} type='submit' value='Продолжить'/>
            </div>
          </form>
        </div>
        <div className={imgLoaded ? '' : 'hidden'}>
          <button onClick={this.clearCanvas}>Очистить</button>
          <button onClick={this.saveQuestion}>Сохранить</button>
          <div className='canvasArea'>
            <canvas id="canvasBackground"></canvas>
            <canvas id="canvasDrawArea"></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateQuestion)
