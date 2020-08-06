import React, { Component } from 'react';

class EmailVerification extends Component {
  render() {
    const { modal } = this.props.stores

    return (
      <div className="login-wrap">
        <p className="mb-5 info-popup">
          {
            modal.msg === 'success'
              ? 'Your place in line has been confirmed!'
              : 'We could\'t not confirm your email'
          }
        </p>
      </div>
    )
  }
}

export default EmailVerification;
