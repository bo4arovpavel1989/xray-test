import React from 'react'
import { withRouter } from 'react-router-dom'
import { postFile } from './../../actions'

class CreateQuestion extends React.Component {
  constructor () {
    super()

    this.state = {
      err: false,
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

    const slide = document.querySelector('input[name="slide"]');
    const photo = document.querySelector('input[name="photo"]');
    const data = new FormData();
    const { name, isDanger } = this.state.question;

    data.append('question', name);
    data.append('slide', slide.files[0]);
    if (isDanger === '1') data.append('photo', photo.files[0]);

    postFile('preupload', data)
      .then(rep => alert(rep))
      .catch(err => alert(err));
  }

  handleChange (e) {
    const { question } = this.state;

    question[e.target.id] = e.target.value;
    this.setState({ question }, () => {
      console.log(this.state)
    });
  }

  render () {
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
                <select id='isDanger' onChange={this.handleChange}>
                  <option value='1' selected>Да</option>
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
              <input type='submit' value='Продолжить'/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateQuestion)
