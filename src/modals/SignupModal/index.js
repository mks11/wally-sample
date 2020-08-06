import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Input } from 'reactstrap';
import { validateEmail, connect, logEvent } from '../../utils'
import FBLogin from '../../common/FBLogin'

class SignupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pin: '',
      name: '',
      email: '',
      password: '',
      invalidText: '',
      signupRequest: false,
      pinError: false,
      displayPinErrorInfo: false,
    }
  }

  handleSubmit = e => {
    const {
      name,
      email,
      password,
      signupRequest,
    } = this.state

    if (!signupRequest) {
      this.setState({ invalidText: '', signupRequest: true })

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
        this.props.store.routing.push('/main')
        
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
      name,
      email,
      password,
      invalidText,
      signupRequest
    } = this.state
    const { user } = this.props.stores
    const additionalFBdata = {
      reference_promo: user.refPromo
    }

    return (
      <div className="signup-wrap">
        <h3 className="m-0 mb-2">Sign up</h3>
        <div className="form-wrapper">

          <Input
            className="aw-input--control mb-3 black"
            type="text"
            name="email"
            placeholder="Enter your email"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}
          />
          <Input
            className="aw-input--control mb-3 black"
            type="text"
            name="name"
            placeholder="Enter your name"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}
          />
          <Input
            className="aw-input--control mb-3 black"
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
            className={`btn btn-main ${(name && email && password && !signupRequest) ? 'active' : ''}`}
            onClick={this.handleSubmit}
          >
            CREATE ACCOUNT
          </button>

          <div className="fancy-spacing my-4">
            <span>or</span>
          </div>

          <FBLogin
            userStore={user}
            additionalData={additionalFBdata}
            onSubmit={this.props.toggle}
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

export default connect("store")(SignupModal)
