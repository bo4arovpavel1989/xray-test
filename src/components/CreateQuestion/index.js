import React from 'react'
import { withRouter } from 'react-router-dom'

class CreateQuestion extends React.Component {
  constructor () {
    super()

    this.state = {
      err: false,
      question: {
        name: '',
        isDanger: true
      }
    }
  }

  render () {
    return (
      <div>
        <div className='formArea'>
          <form>
            <div>
              <label>
                Вопрос: &emsp;
                <input pattern='[0-9]+_[0-9]+' name='name' type='text' placeholder='№ Теста_№ вопроса'/>
              </label>
            </div>
            <div>
              <label>
                Загрузите слайд: &emsp;
                <input name='slide' type='file'/>
              </label>
            </div>
            <div>
              <label>
                Багаж опасен? &emsp;
                <select>
                  <option value='1' selected>Да</option>
                  <option value='0'>нет</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Загрузите фото: &emsp; <input name='photo' type='file'/>
              </label>
            </div>
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
