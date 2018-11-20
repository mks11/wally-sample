import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { validateEmail, connect } from '../utils'
import FacebookLogin from 'react-facebook-login';
import {Modal} from "react-bootstrap";

import { FB_KEY } from '../config'

class LoginModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',

      invalidText: '',

      facebookRequest: false
    }

    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
    this.checkoutStore = this.props.store.checkout

    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleSubmit(e) {
    this.setState({ invalidText: ''})
    if (!this.state.password) {
      this.setState({ invalidText: 'Password cannot be empty'})
      return
    }

    this.userStore.login(this.state.email, this.state.password)
      .then((user) => {
        this.modalStore.toggleLogin()
        this.routing.push(this.modalStore.loginNextRoute)
        this.setState({email: '', password: ''})
      }).catch((e) => {
        console.error('Failed to login', e)
        const msg = e.response.data.error.message
        this.setState({invalidText: msg})
      })
    e.preventDefault()
  }


  handleNext(e) {
    this.setState({invalidText: ''})
    if (!this.state.email) {
      this.setState({invalidText: 'Email cannot be empty'})
      return
    }

    if (!validateEmail(this.state.email)) {
      this.setState({invalidText: 'Email not valid'})
      return
    }


    this.modalStore.setLoginStep(2)

    e.preventDefault()
  }

  handlePrev(e) {
    this.setState({invalidText: '', password:''})
    this.modalStore.setLoginStep(this.modalStore.loginStep - 1)
    e.preventDefault()
  }

  handleLogin(e) {
    this.modalStore.toggleZip()
    this.modalStore.toggleLogin()
  }

  handleToggle = () => {
    this.setState({invalidText: '', email: '', password: ''})
    this.modalStore.toggleLogin()
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value.toLowerCase()})
    e.preventDefault()
  }

  handleEmailEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleNext(e)
    }
  }

  handlePasswordEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  responseFacebook = (data) => {
    if (this.state.facebookRequest) {
      return
    }
    this.setState({facebookRequest: true})
    this.userStore.loginFacebook(data).then((response) => {
      this.modalStore.toggleLogin()
      this.setState({facebookRequest: false})
    }).catch((e) => {
      console.error('Failed to login', e)
      // const msg = e.response.data.error.message
      // this.setState({invalidText: msg})
    })
  }

  handleForgotPassword = () => {
    this.userStore.forgotPassword(this.state.email).then((data) => {
      this.modalStore.setLoginStep(3)
    }).catch((e) => {
      console.error('Failed to login', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })
  }

  render() {
    const store = this.props.store

    let buttonNextClass = 'btn btn-main'
    if (this.state.email) {
      buttonNextClass += ' active'
    }

    let buttonSubmitClass = 'btn btn-main'
    if (this.state.password) {
      buttonSubmitClass += ' active'
    }

    const ErrorInfo = () => {
      return (
        <div>{ this.state.invalidText && <span className="text-error text-center my-3">{this.state.invalidText}</span>}</div>
      )
    }
    return (
      <Modal show={store.modal.login} onHide={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          { this.modalStore.loginStep >=2  ? <button className="btn-icon btn-icon--back" onClick={e => this.handlePrev(e)}></button>
              : <div></div>
          }
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <Modal.Body>
          <div className="login-wrap pb-2">
            { this.modalStore.loginStep <= 2 && (
              <div>
                <h3 className="m-0 mb-2">Log in</h3>
                <span className="mb-5">Welcome Back</span>
              </div>
            )}
            <form onSubmit={e => e.preventDefault()}>
              { this.modalStore.loginStep === 1 && (
                <div>
                  <Input
                    autoFocus
                    className="aw-input--control aw-input--center mb-5"
                    type="text"
                    placeholder="Enter your email"
                    onKeyDown={this.handleEmailEnter}
                    onChange={this.handleEmailChange}/>
                  <ErrorInfo/>
                  <button type="button" className={buttonNextClass} onClick={e => this.handleNext(e)}>
                    SUBMIT
                  </button>
                  
                  <div className="fancy-spacing my-4">
                    <hr/>
                    <span>or</span>
                    <hr/>
                  </div>
                  <FacebookLogin
                    appId={FB_KEY}
                    cssClass="btn btn-blue-fb"
                    autoLoad={false}
                    textButton="FACEBOOK"
                    fields="name,email,picture"
                    scope="public_profile,email"
                    callback={this.responseFacebook}
                    disableMobileRedirect={true}
                  />
                  <hr className="mt-5"/>
                </div>
              )
             }

              { this.modalStore.loginStep === 2 &&
                  <div>
                  <Input
                    autoFocus
                    className="aw-input--control aw-input--center"
                    type="password"
                    placeholder="Enter your password"
                    onKeyDown={this.handlePasswordEnter}
                    onChange={(e) => this.setState({password: e.target.value})}/>
                  <a className="forgot-text mt-2 mb-4" onClick={this.handleForgotPassword}>Forgot Password?</a>
                  <ErrorInfo/>
                  <button type="button" className={buttonSubmitClass} onClick={e => this.handleSubmit(e)}>
                    SUBMIT
                  </button>
                  <div className="mb-5"></div>
                </div>
              }

              { this.modalStore.loginStep === 3 &&
                  <div>
                    <h3>Forgot Password</h3>
                    <p>Check your email for instructions how to reset your password</p>
                  </div>
              }

            </form>
          </div>
        </Modal.Body>
        {this.modalStore.loginStep === 1 &&
        <Modal.Footer>
          <div className="login-wrap mb-5">
            <span className="t-18">New to The Wally Shop</span>
            <a onClick={e=>this.handleLogin(e)} className="btn-text btn-text--login">SIGN UP</a>
          </div>
        </Modal.Footer>
        }
      </Modal>
    );
  }
}

export default connect("store")(LoginModal);
