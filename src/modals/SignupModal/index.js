import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Input } from 'reactstrap';
import { validateEmail, connect, logEvent, logModalView, logPageView } from '../../utils'
import FBLogin from '../../common/FBLogin'

class SignupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pin: '',
      name: '',
      email: '',
      password: '',
      signupEmail: '',

      invalidText: '',
      signupRequest: false,
      pinError: false,
      displayPinErrorInfo: false,
    }
  }

  handleSubmit = e => {
    const {
      pin,
      name,
      email,
      password,
      signupRequest,
      pinError,
    } = this.state

    if (!signupRequest) {
      this.setState({ invalidText: '', signupRequest: true })
      if (pin && pinError) {
        this.setState({ invalidText: 'Pin is incorrect', signupRequest: false })
        return
      }

      if (!name) {
        this.setState({ invalidText: 'Name cannot be empty', signupRequest: false })
        return
      }

      if(!validateEmail(email)) {
        this.setState({ invalidText: 'Email not valid', signupRequest: false })
        return
      }

      if (!password) {
        this.setState({ invalidText: 'Password cannot be empty', signupRequest: false })
        return
      }

      const {
        user,
        zip,
        checkout
      } = this.props.stores

      logEvent({ category: "Signup", action: "SubmitInfo" })
      user.signup({
        name,
        email,
        password,
        signup_zip: zip.selectedZip,
        reference_promo: user.refPromo || user.giftCardPromo
      }).then(data => {
        user.setUserData(data.user)
        user.setToken(data.token)
        checkout.getCurrentCart(user.getHeaderAuth(),  user.getDeliveryParams())
        checkout.getDeliveryTimes()
        this.setState({ signupRequest: false })
        this.props.switchTo('welcome')

        user.giftCardPromo = null
        user.refPromo = null
      }).catch(e => {
        console.error('Failed to signup', e)
        const msg = e.response.data.error.message
        this.setState({ invalidText: msg, signupRequest: false })
      })
    }
    e.preventDefault()
  }

  handleKeySubmit = e => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  handleLogin = () => {
    this.props.switchTo('login')
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

  handlePinVerification = e => {
    const { user } = this.props.stores
    const {
      pin,
      email,
    } = this.state

    user.verifyPin(pin, email)
      .then(res => {
        this.setState({ pinError: !res.verified })
      }).catch(() => {
        this.setState({ pinError: true })
      })
      .finally(() => {
        this.setState({ displayPinErrorInfo: true })
      })
  }

  render() {
    const {
      pin,
      name,
      email,
      password,
      signupEmail,
      invalidText,
      signupRequest,
      pinError,
      displayPinErrorInfo,
    } = this.state
    const { user } = this.props.stores
    const additionalFBdata = {
      reference_promo: user.refPromo
    }

    return (
      <div className="signup-wrap">
        <h3 className="m-0 mb-2">Sign up</h3>
        <span className="mb-3">TWS is still in limited release. If you haven't already, enter your email below to join the waitlist and we'll email you when we get to your batch so you can start shopping waste-free.</span>
        <div className="form-wrapper">
          <Input
            className="aw-input--control mb-2 black"
            type="text"
            name="signupEmail"
            placeholder="Enter your email"
            onKeyDown={this.handleEmailKeySubmit}
            onChange={this.onValueChange}
          />
          <button
            className={`btn btn-main mb-2 ${signupEmail ? 'active' : ''}`}
            onClick={this.handleSignUp}
          >
            JOIN WAITLIST
          </button>
          <br></br>
          <span className="mb-3">Received your confirmation email? Enter your unique pin below and complete the sign up process.</span>
          <div className="pin-input">
            <Input
              className="aw-input--control black"
              type="text"
              name="pin"
              placeholder="Enter pin"
              onKeyDown={this.handleKeySubmit}
              onChange={this.onValueChange}
              onBlur={this.handlePinVerification}
            />
            {displayPinErrorInfo ? (
              !pinError ? (
                <i className="fa fa-check pin-input-ok" />
              ) : (
                <i className="fa fa-times pin-input-ok" />
              )
            ) : null}
          </div>

          <Input
            className="aw-input--control mb-2 black"
            type="text"
            name="email"
            placeholder="Enter your email"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}
            onBlur={this.handlePinVerification}
          />
          <Input
            className="aw-input--control black"
            type="text"
            name="name"
            placeholder="Enter your name"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}
          />
          <Input
            className="aw-input--control black"
            type="password"
            name="password"
            placeholder="Enter your password"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}
          />

          <span className="tnc mt-5 mb-5">
            By signing up, you agree to our <Link target="_blank" to={"/tnc"}><i>Terms of Service</i></Link> &nbsp;and
            &nbsp;<Link target="_blank" to={"/privacy"}><i>Privacy Policy.</i></Link>
          </span>
          {
            invalidText
              ? <span className="text-error text-center my-3">{invalidText}</span>
              : null
          }

          <button
            className={`btn btn-main ${(pin && name && email && password && !signupRequest && !pinError) ? 'active' : ''}`}
            onClick={this.handleSubmit}
          >
            SIGN UP
          </button>

          <div className="fancy-spacing my-4">
            <span>or</span>
          </div>

          <FBLogin
            userStore={user}
            additionalData={additionalFBdata}
            onSubmit={this.props.toggle}
            canSubmit={pin && !pinError}
          />
        </div>
        <div className="login-wrap text-center">
          <span className="">Already have an account?</span>
          <button type="button" onClick={this.handleLogin} className="btn-text btn-text--login">LOG IN HERE</button>
        </div>
      </div>
    )
  }

}

export default SignupModal
