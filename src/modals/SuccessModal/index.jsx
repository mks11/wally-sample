import React, { Component } from 'react';

class Success extends Component {
  handleClose = () => {
    this.props.toggle();
  };

  render() {
    const { modal } = this.props.stores;

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2 text-success">
          {modal.msg ? modal.msg : 'Success'}
        </h3>
        <p className="mb-5 info-popup">
          {modal.msg || 'Your request was successful!'}
        </p>
      </div>
    );
  }
}

export default Success;
