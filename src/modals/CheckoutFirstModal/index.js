import React, { Component } from 'react'

class CheckoutFirstModal extends Component {
  componentDidMount() {
    const { user } = this.props.stores
    user.updateFlags('checkoutFirst', true)
  }

  handleStart = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Packaging Deposit?</h3>
        <p className="mb-5 info-popup">
          To deliver you the Wally Signature reusables experience, we charge a deposit on your packaging. 
        </p>
        <button onClick={this.handleStart} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default CheckoutFirstModal
