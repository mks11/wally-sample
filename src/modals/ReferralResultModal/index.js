import React, { Component } from 'react';

class ReferralResultModal extends Component {

  render() {
    const { modal } = this.props.stores
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Gift Card Referral</h3>
        <span className="mb-1">
          {modal.msg}
        </span>
      </div>
    )
  }
}

export default ReferralResultModal
