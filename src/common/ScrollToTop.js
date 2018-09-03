import React from 'react'
import {withRouter} from 'react-router-dom'
import { formatMoney, connect } from '../utils'
class ScrollToTop extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.routing)
  }
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)