import React from 'react'
import { withRouter } from 'react-router-dom'
import { postFile } from './../../actions'
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
  }

  uploadPhotos (e) {
    e.preventDefault();
    this.setState({ loading: true });

    const slide = document.querySelector('input[name="slide"]');
    const photo = document.querySelector('input[name="photo"]');
    const data = new FormData();
    const { name, isDanger } = this.state.question;

    data.append('question', name);
    data.append('slide', slide.files[0]);
    if (isDanger === '1') data.append('photo', photo.files[0]);

    postFile('preupload', data)
      .then(rep => {
        console.log(rep)
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

  handleChange (e) {
    const { question } = this.state;

    question[e.target.id] = e.target.value;
    this.setState({ question });
  }

  prepareCanvas () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = this.state.dimensions;

    canvas.width = width;
    canvas.height = height;

    const background = new Image();

    background.src = this.state.imgPath;
    background.onload = () => {
      ctx.drawImage(background, 0, 0);
      this.drawDangerZone();
    }
  }

  drawDangerZone () {
  // TODO draw rectangles
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
        {
          imgLoaded ?
          <div className='canvasArea'>
            <canvas id="canvas"></canvas>
          </div> :
          ''
        }
      </div>
    )
  }
}

export default withRouter(CreateQuestion)
