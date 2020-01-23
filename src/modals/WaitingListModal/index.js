import React, { Component } from 'react';
import FlipCounterJs from 'flip-counter-js';

class WaitingListModal extends Component {

  componentDidMount() {
    const { modal } = this.props.stores
    const { waitlist_position } = modal.modalData

    new FlipCounterJs(
      document.getElementById('waitingListCounter'),
      {
        speed: 0,
        minDigits: 2,
        start: waitlist_position,
        size: 'lg',
      }
    )
  }

  render() {
    const { modal } = this.props.stores

    const {
      user_link,
      verified_email
    } = modal.modalData

    return (
      <div className="waitinglist-content">
        <h3 className="m-0 mb-4">Thank you!</h3>
        <div className="text-caps"><strong>You are:</strong></div>
        <div id="waitingListCounter" />
        <div className="text-caps"><strong>In line</strong></div>
        {!verified_email ? (
          <p className="m-2 text-error">Please check your email to verify your email and confirm your place in line</p>
        ) : null}
        <p className="m-4">We will reach out as soon as we are ready for you to start ordering.</p>

        <p>
          To get earlier access, share this link: {user_link}.
          <br />
          Plus, more people shopping package free means a 🌱planet
        </p>
      </div>
    )
  }
}

export default WaitingListModal;
