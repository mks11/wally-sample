import React, { Component } from 'react'

class MainFirstModal extends Component {
  componentDidMount() {
    const { user } = this.props.stores
    user.updateFlags('mainFirst', true)
  }

  handleStart = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">No mark up, no problem.</h3>
        <p className="mb-5">
          The prices you see on our website are the exact ones we pay at the farmers markets and bulk shops, so you can be sure you’re getting the lowest price possible.
          <br/>
          <br/>
          <small>Prices on website are general estimates; subject to change based on actual prices paid.</small>
        </p>
        <button onClick={this.handleStart} className="btn btn-main active">Got it!</button>
      </div>
    )
  }
}

export default MainFirstModal
