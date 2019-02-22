import React from 'react'
import { withRouter } from 'react-router-dom'
import { postFile, postData, getData } from './../../actions'
import Drawer from '../Drawer'
import './CreateQuestion.sass'

class CreateQuestion extends React.Component {
  constructor () {
    super()

    this.state = {
      loading: false,
      err: false,
      imgPath: '',
      dimensions: { width: 0, height: 0 },
      dangerZones: [],
      name: '',
      isDanger: '1'
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
    this.checkIfQuestionCreated()
  }

  componentWillUnmount () {
    this.drawer.reset();
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

  /**
   * Method checks location query
   * if query is defined ( /create/question?question=name )
   * it means user want to edit old question
   * so we fetch question to API
   * @return {Function} - fetch to API for question data
   */
  checkIfQuestionCreated () {
    if (this.props.location.search.length > 0) {
      const query = new URLSearchParams(this.props.location.search);
      const question = query.get('question');

      return this.getQuestion(question)
    }
  }

  /**
   * Method fetches to API for question data
   * if any - renders it
   * @returns {Function} - fetch to API
   */
  getQuestion (question) {
    return getData(`question/${question}`)
            .then(rep => {
              console.log(rep)
              if (rep) {
                this.setState(rep, this.prepareCanvas)
              }
            })
            .catch(err => window.alert(err))
  }

  /**
   * Method handles upload of slide and photo
   * then it gets dimensions of slide and prepares canvas for it
   * @return {void}
   */
  uploadPhotos (e) {
    e.preventDefault();

    const data = this.handleFormData();

    this.setState({ loading: true });
    postFile('preupload', data)
      .then(rep => {
        const { name } = this.state;
        const imgPath = `/images/${name}_slide.${rep.type}`;
        this.drawer.reset();

        this.setState({
          loading: false,
          imgPath: imgPath,
          dimensions: rep
        }, this.prepareCanvas)
      })
      .catch(err => {
        this.setState({ loading: false })
        window.alert(err)
      });
  }

  /**
   * Method gatheres all formData to single object for upload
   * @return {Object} - object to upload
   */
  handleFormData () {
    const slide = document.querySelector('input[name="slide"]');
    const photo = document.querySelector('input[name="photo"]');
    const { name, isDanger } = this.state;
    const data = new FormData();

    data.append('question', name);
    data.append('slide', slide.files[0]);
    if (isDanger === '1') data.append('photo', photo.files[0]);

    return data;
  }

  /**
   * Method handles changes in input and pass it to state
   * @returns {void}
   */
  handleChange (e) {
    const data = {};

    data[e.target.id] = e.target.value;

    this.setState(data);
  }

  /**
   * Method sets canvas width and heigth, add background image
   * and inits drawing dangerzone rectangels
   * @returns {void}
   */
  prepareCanvas () {
    this.setCanvasDimensions();

    const background = new Image();

    background.src = this.state.imgPath;
    background.onload = () => {
      this.setCanvasBackground(background)
      this.drawDangerZone();
    }
  }

  /**
   * Method set canvas width and heigth - both for background and draw layers
   * @returns {void}
   */
  setCanvasDimensions () {
    const { width, height } = this.state.dimensions;

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
   * @returns {Function} - start method of this.draw
   */
  drawDangerZone (c) {
    const { dangerZones } = this.state;

    if (dangerZones.length > 0) this.drawer.drawOldZones(dangerZones);

    return this.drawer.start()
  }

  /**
   * Method calls clearZones mthod of this.drawer
   * to clear canvas draw layer
   */
  clearCanvas () {
    return this.drawer.clearZones()
  }

  /**
   * Method gatheres all question data to single object and post to API
   * @returns {Function} - fetch post API
   */
  saveQuestion () {
    const { imgPath, name, isDanger, dimensions } = this.state;

    const question = {
      name,
      isDanger,
      dangerZones: this.drawer.getZones(),
      imgPath,
      dimensions
     };

     this.setState({ loading: true });

     return postData('savequestion', question)
              .then(rep => {
                window.alert('Успешно сохранено!');
                this.setState({ loading: false })
              })
              .catch(err => {
                window.alert(err);
                this.setState({ loading: false })
              })
  }

  render () {
    const { loading, isDanger, name } = this.state;

    return (
      <div className='container'>
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
                  value = {name.length > 0 ? name : ''}
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
                <select
                  id='isDanger'
                  onChange={this.handleChange}
                  value={isDanger === '1' ? '1' : '0'}
                >
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
        <div>
          <button onClick={this.clearCanvas}>Очистить</button>
          <button disabled={loading} onClick={this.saveQuestion}>Сохранить</button>
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
