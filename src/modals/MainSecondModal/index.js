import React, { Component } from 'react'

class MainSecondModal extends Component {
  componentDidMount() {
    const { user } = this.props.stores
    user.updateFlags('mainSecond', true)
  }

  handleClose = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Competitive Prices.</h3>
        <p className="mb-5 info-popup">
          We take our pricing very seriously and our Wally staples are meant to bring you the best in value, without any waste. In fact, email us at <a href="mailto:info@thewallyshop.co"> info@thewallyshop.co </a> if you see the same product cheaper elsewhere.
        </p>
        <button onClick={this.handleClose} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default MainSecondModal
