import React, { Component } from 'react';
import FlipCounterJs from 'flip-counter-js';

class WaitingListModal extends Component {

  componentDidMount() {
    const { modal } = this.props.stores
    const { waitlist_position } = modal.modalData

    const size = waitlist_position > 999 ? 'md' : 'lg'

    new FlipCounterJs(
      document.getElementById('waitingListCounter'),
      {
        speed: 0,
        minDigits: 2,
        start: waitlist_position,
        size,
      }
    )
  }

  handleCopy = () => {
    const $el = this.el
    // console.log($el)
    $el.select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successfully' : 'unsuccessfully'
      console.log('text coppied ' + msg)
    } catch (err) {
      console.log('Unable to copy text')
    }
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
        ) : (
          <p className="m-2 text-success">Your place in line is confirmed!</p>
        )}
        <p className="m-4">We will reach out as soon as we are ready for you to start ordering.</p>
        <p className="m-4">The first 1000 people will have access to launch!</p>

        <p>
          <strong>Refer a friend & skip</strong>
          <br></br>
          Spread the reusables love. For every friend that joins, you'll skip ahead 100 places :)
          <input
            className="waitinglist-link"
            type="text"
            value={user_link}
            ref={el => this.el = el}
            readOnly
          />
          <button
            className="btn btn-transparent waitinglist-copy"
            type="button"
            onClick={this.handleCopy}
          >
            Copy to Clipboard
          </button>
          <br />
          Plus, more people shopping package free means a 🌱planet
        </p>
      </div>
    )
  }
}

export default WaitingListModal;
