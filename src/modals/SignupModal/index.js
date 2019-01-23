import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Input } from 'reactstrap';
import { validateEmail } from '../../utils'
import FBLogin from '../../common/FBLogin'

class SignupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',

      invalidText: '',
      signupRequest: false,
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
      if(!validateEmail(email)) {
        this.setState({ invalidText: 'Email not valid', signupRequest: false })
        return
      }

      if (!name) {
        this.setState({ invalidText: 'Name cannot be empty', signupRequest: false })
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

      user.signup({
        name,
        email,
        password,
        signup_zip: zip.selectedZip,
        reference_promo: user.refPromo || user.giftCardPromo
      }).then(data => {
        user.setUserData(data.user)
        user.setToken(data.token)
        this.props.switchTo('welcome')
        checkout.getCurrentCart(user.getHeaderAuth(),  user.getDeliveryParams())
        this.setState({ signupRequest: false })
        user.giftCardPromo = null
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

  render() {
    const {
      name,
      email,
      password,
      invalidText,
      signupRequest,
    } = this.state
    const { zip, user } = this.props.stores
    const additionalFBdata = {
      signup_zip: zip.selectedZip,
      reference_promo: user.refPromo
    }

    return (
      <div className="signup-wrap">
        <h3 className="m-0 mb-2">Sign up</h3>
        <span className="mb-5">Shop package-free groceries</span>
        <div className="form-wrapper">
          <Input
            className="aw-input--control"
            type="text"
            name="name"
            placeholder="Enter your name"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}/>
          <Input
            className="aw-input--control"
            type="text"
            name="email"
            placeholder="Enter your email"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}/>
          <Input
            className="aw-input--control"
            type="password"
            name="password"
            placeholder="Enter your password"
            onKeyDown={this.handleKeySubmit}
            onChange={this.onValueChange}/>

          <span className="tnc mt-3 mb-2">
            By signing up, you agree to our <Link target="_blank" to={"/tnc"}><strong>Terms of Service</strong></Link> &nbsp;and 
            &nbsp;<Link target="_blank" to={"/privacy"}><strong>Privacy Policy.</strong></Link>
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
            SUBMIT
          </button>

          <div className="fancy-spacing my-4">
            <hr/>
            <span>or</span>
            <hr/>
          </div>

          <FBLogin
            additionalData={additionalFBdata}
            onSubmit={this.props.toggle}
          />
        </div>
        <div className="login-wrap">
          <span className="t-18">Already have an account</span>
          <button type="button" onClick={this.handleLogin} className="btn-text btn-text--login">LOGIN</button>
        </div>
      </div>
    )
  }

}

export default SignupModal
