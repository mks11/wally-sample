import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { validateEmail, connect, logEvent, logModalView, logPageView } from '../../utils'
import FBLogin from '../../common/FBLogin'

const ErrorInfo = props => {
  return (
    props.invalidText
      ? <div><span className="text-error text-center my-3">{props.invalidText}</span></div>
      : null
  )
}

class LoginModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      email: '',
      password: '',
      invalidText: '',
    }
  }

  handleSubmit = e => {
    this.setState({ invalidText: ''})
    const {
      email,
      password,
    } = this.state
    const { user, routing } = this.props.stores

    if (!password) {
      this.setState({ invalidText: 'Password cannot be empty'})
      return
    }

    user.login(email, password)
      .then(user => {
        this.props.toggle()
        routing.push('/')
      }).catch(e => {
        console.error('Failed to login', e)
        const msg = e.response.data.error.message
        this.setState({ invalidText: msg })
      })
    e.preventDefault()
  }


  handleNext = e => {
    const { email } = this.state

    if (!email) {
      this.setState({ invalidText: 'Email cannot be empty' })
      return
    } else if (!validateEmail(email)) {
      this.setState({ invalidText: 'Email not valid' })
      return
    }

    this.setState({ step: 2 })
    e.preventDefault()
  }

  handlePrev = e => {
    const { step } = this.state
    this.setState({
      invalidText: '',
      password:'',
      step: step - 1,
    })
    e.preventDefault()
  }

  handleLogin = e => {
    logModalView('/signup-zip')
    this.props.switchTo('zip')
  }

  handleInputChange = e => {
    const value = e.target.name === 'email'
                    ? e.target.value.toLowerCase()
                    : e.target.value

    this.setState({
      [e.target.name]: value,
      invalidText: ''
    })
    e.preventDefault()
  }

  handleEnter = e => {
    if (e.keyCode === 13) {
      e.target.name === 'email'
        ? this.handleNext(e)
        : this.handleSubmit(e)
    }
  }

  handleForgotPassword = () => {
    const { user } = this.props.stores
    const { email } = this.state

    user.forgotPassword(email)
      .then(data => {
        this.setState({ step: 3 })
      }).catch((e) => {
        console.error('Failed to login', e)
        const msg = e.response.data.error.message
        this.setState({ invalidText: msg })
      })
  }

  render() {
    const {
      step,
      email,
      password,
      invalidText,
    } = this.state

    return (
      <div className="login-wrap">
        { step >=2 
            ? <button className="btn-icon btn-icon--back" onClick={this.handlePrev}></button>
            : null
        }
        { step <= 2 && (
          <div>
            <h3 className="m-0 mb-2">Log in</h3>
            <span className="mb-5">Welcome Back</span>
          </div>
        )}
        <div>
          { step === 1 && (
            <div>
              <Input
                className="aw-input--control aw-input--center"
                type="text"
                name="email"
                value={email}
                placeholder="Enter your email"
                onKeyDown={this.handleEnter}
                onChange={this.handleInputChange}
              />
              <ErrorInfo invalidText={invalidText} />
              <button type="button" className={`btn btn-main mt-5 ${email ? 'active' : ''}`} onClick={this.handleNext}>
                SUBMIT
              </button>              
              <div className="fancy-spacing my-4">
                <hr/>
                <span>or</span>
                <hr/>
              </div>
              <FBLogin onSubmit={this.props.toggle} />
              <hr className="mt-5"/>
            </div>
          )
          }

          { step === 2 &&
            <div>
              <Input
                className="aw-input--control aw-input--center"
                type="password"
                name="password"
                placeholder="Enter your password"
                onKeyDown={this.handleEnter}
                onChange={this.handleInputChange}
              />
              <a className="forgot-text mt-2 mb-4" onClick={this.handleForgotPassword}>Forgot Password?</a>
              <ErrorInfo invalidText={invalidText} />
              <button type="button" className={`btn btn-main ${password ? 'active' : ''}`} onClick={this.handleSubmit}>
                SUBMIT
              </button>
              <div className="mb-5"></div>
            </div>
          }

          { 
            step === 3 &&
            <div>
              <h3>Forgot Password</h3>
              <p>Check your email for instructions how to reset your password</p>
            </div>
          }
        </div>
        <div className="login-wrap">
          <span className="t-18">New to The Wally Shop</span>
          <button onClick={this.handleLogin} className="btn-text btn-text--login">SIGN UP</button>
        </div>
      </div>
    )
  }
}

export default LoginModal
