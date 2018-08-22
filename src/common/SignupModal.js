import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { validateEmail, connect } from '../utils'

class SignupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',

      invalidText: ''
    }

    this.modalStore = this.props.store.modal
    this.userStore = this.props.store.user
    this.zipStore = this.props.store.zip
    this.routing = this.props.store.routing
  }
  handleSubmit(e) {
    this.setState({invalidText: ''})
    if(!validateEmail(this.state.email)) {
      this.setState({invalidText: 'Email not valid'})
      return
    }

    if (!this.state.name) {
      this.setState({invalidText: 'Name cannot be empty'})
      return
    }

    if (!this.state.password) {
      this.setState({invalidText: 'Password cannot be empty'})
      return
    }

    this.userStore.signup({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      signup_zip: this.zipStore.selectedZip
    }).then((data) => {
      this.userStore.setUserData(data.user)
      this.userStore.setToken(data.token)
      this.modalStore.toggleSignup()
      this.modalStore.toggleWelcome()
    }).catch((e) => {
      console.error('Failed to signup', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })


    e.preventDefault()
  }

  handleKeySubmit = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  handleLogin() {
    this.routing.push('/main')
    this.modalStore.toggleSignup()
    this.modalStore.toggleLogin()
  }

  handleToggle = () => {
    this.modalStore.toggleSignup()
  }

  render() {
    let buttonClass = 'btn btn-main'
    if (this.state.name && this.state.email && this.state.password) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={this.modalStore.signup} toggle={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <ModalBody>
          <div className="signup-wrap">
            <h3 className="m-0 mb-2">Sign up</h3>
            <span className="mb-5">Shop package-free groceries</span>
            <form onSubmit={e => e.preventDefault()}>
              <Input
                autoFocus
                className="aw-input--control"
                type="text"
                placeholder="Enter your name"
                onKeyDown={this.handleKeySubmit}
                onChange={(e) => this.setState({name: e.target.value})}/>
              <Input
                className="aw-input--control"
                type="text"
                placeholder="Enter your email"
                onKeyDown={this.handleKeySubmit}
                onChange={(e) => this.setState({email: e.target.value})}/>
              <Input
                className="aw-input--control"
                type="password"
                placeholder="Enter your password"
                onKeyDown={this.handleKeySubmit}
                onChange={(e) => this.setState({password: e.target.value})}/>

              <span className="tnc mt-3 mb-2">
                By signing up, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy.</strong>
              </span>
              { this.state.invalidText ? <span className="text-error text-center my-3">{this.state.invalidText}</span> : null}

              <button className={buttonClass} onClick={e => this.handleSubmit(e)}>SUBMIT</button>
              <div className="fancy-spacing my-4">
                <hr/>
                <span>or</span>
                <hr/>
              </div>
              <button className="btn btn-blue-fb">FACEBOOK</button>

            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="login-wrap mb-5">
            <span className="t-18">Already have an account</span>
            <a onClick={e=>this.handleLogin()} className="btn-text btn-text--login">LOGIN</a>
          </div>
        </ModalFooter>
      </Modal>
    );
  }

}

export default connect("store")(SignupModal);
