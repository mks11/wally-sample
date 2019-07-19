import React, { Component } from 'react'

class MainError extends Component {
  handleClose = () => {
    this.props.toggle()
  }

  render() {
    const { modal } = this.props.stores

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2 text-error">{modal.msg ? 'Error' : 'Oops!'}</h3>
        <p className="mb-5 info-popup">
          {modal.msg || 'Something went wrong during your request. Please try again later.'}
        </p>
      </div>
    )
  }
}

export default MainError
