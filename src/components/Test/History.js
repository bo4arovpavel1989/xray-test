import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Drawer from '../Drawer'

class History extends React.PureComponent {
  constructor (props) {
    super(props);

    const { testHistory } = this.props;
    const canvasDraw = '#canvasDrawArea';
    const canvasBackground = '#canvasBackground';

    this.state = {
      testHistory,
      currentQuestion: 0
    }

    this.closeHistory = this.closeHistory.bind(this);
  }

  componentDidMount () {
    console.log(this.state.testHistory)
  }

  closeHistory () {
    const { closeHistory } = this.props;

    return closeHistory();
  }

  render () {
    return (
      <div>
        <a onClick= { this.closeHistory }>Закрыть</a>
      </div>
    )
  }
}

History.propTypes = {
  testHistory: PropTypes.array.isRequired,
  closeHistory: PropTypes.func.isRequired
}

export default withRouter(History)
export { History }
