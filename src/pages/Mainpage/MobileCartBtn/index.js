import React, { Component } from 'react';

class MobileCartBtn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hide: false,
      footerPos: 0,
    }
  }

  componentDidMount() {
    const $ = window.$
    $(window).bind('scroll', this.handleHideBtn)
  }

  componentDidUpdate(_, prevState) {
    const $ = window.$
    const footerPos = $('.aw-footer').position().top - $('.aw-footer').outerHeight() - 150
    if (prevState.footerPos !== footerPos) {
      this.setState({ footerPos })
    }
  }

  componentWillUnmount() {
    const $ = window.$
    $(window).unbind('scroll', this.handleHideBtn)
  }

  handleHideBtn = () => {
    const { footerPos } = this.state
    const $ = window.$
    const scrollTop = $(window).scrollTop()
    console.log(scrollTop, footerPos)

    this.setState({
      hide: scrollTop >= footerPos
    })
  }

  render() {
    const { hide } = this.state
    const { onClick, items } = this.props
    
    return (
      hide
        ? null
        : (
          <button
            className="btn-cart-mobile btn d-md-none"
            type="button"
            onClick={onClick}
          >
            <span>{items}</span>View Order
          </button> 
        )
    )
  }
}

export default MobileCartBtn