import React, { Component } from 'react';

class WelcomeModal extends Component {
  handleStart = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Welcome to The Wally Shop</h3>
        <p className="mb-5">
          Enjoy the freshest groceries, at bulk prices, completely package-free.
          <br/>
          <br/>
          Ready to start shopping?
        </p>
        <button onClick={this.handleStart} className="btn btn-main active">START SHOPPING</button>
      </div>
    )
  }
}

export default WelcomeModal;
