import React, { Component } from 'react';

class MainFirstModal extends Component {
  componentDidMount() {
    const { user, modal } = this.props.stores;
    this.modalStore = modal;
    user.updateFlags('mainFirst', true);
  }

  handleClose = () => {
    this.props.toggle();
    this.modalStore.toggleModal('mainSecond');
  };

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Welcome to The Wally Shop</h3>
        <p className="mb-5 info-popup">
          How this works is simple. Everything comes in reusable packaging. You
          pay a deposit for the packaging, and when you return them, you get it
          back. Click <a href="/about"> here </a> for a more detailed How-To.
        </p>
        <button onClick={this.handleClose} className="btn btn-main active">
          Happy Shopping!
        </button>
      </div>
    );
  }
}

export default MainFirstModal;
