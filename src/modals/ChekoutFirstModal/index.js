import React, { Component } from 'react'

class ChekoutFirstModal extends Component {
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
        <h3 className="m-0 mb-2">What are these fees for?</h3>
        <p className="mb-5">
          <strong>Service and delivery fees:</strong> these go straight to our workers who shop for and deliver your groceries
          <br/>
          <br/>
          <strong>Deposit fee:</strong> this fee will be returned to you as store credit when you return our reusable packaging. Let's build a circular economy together!
        </p>
        <button onClick={this.handleStart} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default ChekoutFirstModal
