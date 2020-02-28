import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { validateEmail } from '../../utils'

class JoinWaitlistModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signupEmail: '',
      invalidText: '',
    }
  }

  handleSignUpModal = () => {
    this.props.switchTo('signup')
  }

  onValueChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSignUp = e => {
    if(!validateEmail(this.state.signupEmail)) {
      this.setState({ invalidText: 'Email not valid' })
      return
    }

    const {
      user,
      modal,
    } = this.props.stores

    user.getWaitlistInfo(this.state.signupEmail, user.refPromo)
      .then(res => {
        modal.switchModal('waitinglist', null, res)
      })
      .catch((e) => {
        const msg =  e.response.data.error ? e.response.data.error.message : null
        modal.switchModal('error', msg)
      })
    e.preventDefault()
  }

  handleEmailKeySubmit = e => {
    if (e.keyCode === 13) {
      this.handleSignUp(e)
    }
  }

  render() {
    const {
      signupEmail,
      invalidText,
    } = this.state

    return (
      <div className="signup-wrap">
        <h3 className="m-0 mb-2">Sign up</h3>
        <span className="mb-4">TWS is still in limited release. If you haven't already, enter your email below to join the waitlist and we'll email you when we get to your batch so you can start shopping waste-free.</span>
        <div className="form-wrapper">
          <Input
            className="aw-input--control mb-5 black"
            type="text"
            name="signupEmail"
            placeholder="Enter your email"
            onKeyDown={this.handleEmailKeySubmit}
            onChange={this.onValueChange}
          />
          <button
            className={`btn btn-main mb-4 ${signupEmail ? 'active' : ''}`}
            onClick={this.handleSignUp}
          >
            JOIN WAITLIST
          </button>
          {
            invalidText
              ? <span className="text-error text-center my-3">{invalidText}</span>
              : null
          }
          <br></br>
          <span className="mb-3">Received your confirmation email? Click below to enter your unique pin and complete the sign up process.</span>
        </div>
        <div className="login-wrap text-center">
          <button type="button" onClick={this.handleSignUpModal} className="btn-text btn-text--login">SIGN UP</button>
        </div>
      </div>
    )
  }

}

export default JoinWaitlistModal
