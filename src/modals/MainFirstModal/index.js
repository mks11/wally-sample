import React, { Component } from 'react'

class MainFirstModal extends Component {
  componentDidMount() {
    const { user } = this.props.stores
    user.updateFlags('mainFirst', true)
  }

  handleClose = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">No price markups. Ever.</h3>
        <p className="mb-5 info-popup">
          The prices you pay are the exact ones we pay at the farmers markets and bulk shops, so you can be sure you’re getting the lowest price possible.
          <br/>
          <br/>
          <small>Prices on website are subject to change based on actual prices paid.</small>
        </p>
        <button onClick={this.handleClose} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default MainFirstModal
