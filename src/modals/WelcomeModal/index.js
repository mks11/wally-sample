import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class WelcomeModal extends Component {
  constructor(props) {
    super(props)
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
        <Link to="/main" className="btn btn-main active">START SHOPPING</Link>
      </div>
    )
  }
}

export default WelcomeModal;
