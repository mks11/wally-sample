import React, { Component } from 'react'

class PackagingDepositModal extends Component {
  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Packaging Deposit?</h3>
        <span className="mb-1">
          <small>To deliver the Wally Signature reusable experience, we charge a refundable deposit upon return for each piece of packaging used in your order.
          <br/><br/>
          <ul>
          <li> Shipping Tote - $10 / each </li>
          <br/>
          <li> Reusable Jar - $1 / each </li>
          </ul>
          </small>
        </span>
      </div>
    )
  }
}

export default PackagingDepositModal
