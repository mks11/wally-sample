import React from 'react'
import { withRouter } from 'react-router-dom'

class ScrollSpy extends React.Component {
  componentDidMount() {
    const $ = window.$
    $(window).bind('scroll', this.handleScrollSpy)
  }

  componentWillUnmount() {
    const $ = window.$
    $(window).unbind('scroll', this.handleScrollSpy)
  }

  handleScrollSpy = () => {
    const $ = window.$

    if ($(window).scrollTop() > 0) {
      $('body').addClass('body-scroll')
    } else {
      $('body').removeClass('body-scroll')
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollSpy)
