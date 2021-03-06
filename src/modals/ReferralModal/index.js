import React, { Component } from 'react';
import { logEvent } from 'services/google-analytics';
import ripeNReady from 'images/ripenready.jpg';

class ReferralModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refUrl: '',
    };
  }

  componentDidMount() {
    const { user } = this.props.stores;

    user.referFriend().then((res) => {
      this.setState({
        refUrl: res.data.ref_url,
      });
    });
  }

  handleHere = (e) => {
    this.props.toggle();
  };

  handleCopy = () => {
    logEvent({ category: 'Refer', action: 'CopyReferralLink' });
    const $el = this.el;
    $el.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successfully' : 'unsuccessfully';
      console.log('Text copied ' + msg);
    } catch (err) {
      console.warn('Unable to copy text');
    }
  };

  render() {
    const { refUrl } = this.state;

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">How Ripe & Ready are you?</h3>
        <span className="mb-1">
          <small>
            Refer 2 friends in the next 2 hours and we'll throw in an exclusive
            Wally Ripe & Ready tote in your order. Have them signup using the
            link below:
          </small>
        </span>
        <div className="mb-2 text-center">
          <img
            src={ripeNReady}
            alt="The Wally Shop Ripe 'n Ready tote bag."
            width="70%"
          />
        </div>
        <div className="referral-wrap p-2">
          <input
            type="text"
            style={{ position: 'absolute', zIndex: -100 }}
            value={refUrl}
            ref={(el) => (this.el = el)}
            readOnly
          />
          <span className="referral-link">{refUrl}</span>
          <button
            type="button"
            className="btn btn-transparent btn-transparent-light"
            onClick={this.handleCopy}
          >
            COPY
          </button>
        </div>
      </div>
    );
  }
}

export default ReferralModal;
