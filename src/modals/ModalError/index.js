import React, { Component } from 'react'

class MainError extends Component {
  handleClose = () => {
    this.props.toggle()
  }

  render() {
    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2 text-error">Oops!</h3>
        <p className="mb-5 info-popup">
          Something went wrong during your request. Please try again later.
        </p>
      </div>
    )
  }
}

export default MainError
