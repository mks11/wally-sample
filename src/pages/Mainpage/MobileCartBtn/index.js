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
    // $(window).bind('scroll', this.handleHideBtn)
  }

  componentDidUpdate(_, prevState) {
    const $ = window.$
    const awFooter = $('.aw-footer')
    
    if (awFooter && awFooter.hasOwnProperty('position')) {
      const footerPos = awFooter.position().top - awFooter.outerHeight() - 150
      if (prevState.footerPos !== footerPos) {
        this.setState({ footerPos })
      }
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