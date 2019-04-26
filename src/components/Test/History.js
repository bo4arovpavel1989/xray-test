import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Drawer from '../Drawer'

class History extends React.PureComponent {
  constructor (props) {
    super(props);

    const { history } = this.props;
    const canvasDraw = '#canvasDrawArea';
    const canvasBackground = '#canvasBackground';

    this.state = {
      history
    }
  }

  componentDidMount () {

  }



  render () {

    return (
      <div></div>
    )
  }
}

History.propTypes = {
  history: PropTypes.array.isRequired,
  closeHistory: PropTypes.func.isRequired
}

export default withRouter(History)
export { History }
