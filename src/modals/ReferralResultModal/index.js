import React, { Component } from 'react';

class ReferralResultModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const store = this.props.store
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Gift Card Referral</h3>
        <span className="mb-1">
          {store.modal.resultReferralMsg}
        </span>
      </div>
    )
  }
}

export default ReferralResultModal
