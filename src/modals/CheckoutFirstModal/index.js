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
        <h3 className="m-0 mb-2">What are these fees for?</h3>
        <p className="mb-5 info-popup">
          <strong>Service fee:</strong> this fee is what allows our business and to continue running.
          <br/>
          <br/>
          <strong>Delivery fee:</strong> 100% of the delivery fee goes straight to our dedicated employees who shop for and deliver your groceries, which allows us to pay them fair wages!
          <br/>
          <br/>
          <strong>Deposit fee:</strong> this fee will be returned to you as store credit when you return our reusable packaging. Let's build a circular economy together!
          <br/>
          <br/>
          <strong>Tips:</strong> 100% of tips go directly to our dedicated Wally Shop couriers! While we do pay our workers fair wages, if you want to show them some extra love you can send a tip their way.
          <br/>
          <br/>
          <strong>Prices:</strong> The prices you pay are the exact ones we pay at the farmers markets and bulk shops, so you can be sure you’re getting the lowest price possible.*
          <br/>
          <br/>
          <small>*Prices on website are subject to change based on actual prices paid.</small>
        </p>
        <button onClick={this.handleStart} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default CheckoutFirstModal
