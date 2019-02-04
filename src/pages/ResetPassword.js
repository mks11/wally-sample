import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { connect } from '../utils'


class ResetPassword extends Component {
  state = {
    token_id: '',
    password: '',
    confirmPassword: ''
  }
  constructor(props, context) {
    super(props, context);

    const params = new URLSearchParams(this.props.location.search); 
    const token_id  = params.get('token_id');

    this.state.token_id = token_id

    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  handleSubmit = () => {

    if (!this.state.password) {
      this.setState({invalidText: 'Password cannot be empty'})
      return
    }

    if (!this.state.confirmPassword) {
      this.setState({invalidText: 'Confirm password cannot be empty'})
      return
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({invalidText: 'Password doesn\'t match'})
      return
    }


    this.userStore.resetPassword(this.state.token_id,
      {
        new_password: this.state.password,
        confirm_password: this.state.confirmPassword
      }).then(() => {
      this.routing.push('/main')
      this.modalStore.toggleModal('login')
    }).catch((e) => {
      if (!e.response.data.error) {
        return
      }
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })
  }

  render() {
    let buttonSubmitClass = 'btn btn-main my-4'
    if (this.state.password && this.state.confirmPassword) {
      buttonSubmitClass += ' active'
    }

     return (
      <section className="page-section bg-fruitfull">
          <div className="container-fluid">
            <div className="card">
              <h3 className="m-0 mb-2">Reset your password</h3>
              <span className="mb-0">Please enter and verify your new password.</span>
              <span className="mb-3">Your password needs to be longer than 6 characters.</span>
              <div className="form-wrapper">
                <Input
                  className="aw-input--control aw-input--bordered"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => this.setState({password: e.target.value})}/>
                <Input
                  className="aw-input--control aw-input--bordered mt-2"
                  type="password"
                  placeholder="Verify Password"
                  onChange={(e) => this.setState({confirmPassword: e.target.value})}/>
                <button type="button" className={buttonSubmitClass} onClick={this.handleSubmit}>SUBMIT</button>

                { this.state.invalidText && <div className="text-error text-center my-3">{this.state.invalidText}</div>}
              </div>
            </div>
          </div>
      </section>
    );
  }
}

export default connect("store")(ResetPassword);
