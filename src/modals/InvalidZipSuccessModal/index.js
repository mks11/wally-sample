import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class InvalidZipSuccessModal extends Component {
  constructor(props) {
    super(props)
  }

  handleExpore = e => {
    this.props.toggle()
  }
  
  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-3 text-center" style={{lineHeight: '40px'}}>Thanks!<br/> We'll notify you when we launch in your area.<br/> Follow us on Instagram @thewallyshop and stay up to date on all things sustainability.</h3>
        <p className="text-center">
          <Link to="/main" className="btn btn-primary btn-explore" onClick={this.handleExpore}>Explore</Link>
        </p>
      </div>
    )
  }
}

export default InvalidZipSuccessModal
