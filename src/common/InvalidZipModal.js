import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { validateEmail, connect } from '../utils'

class InvalidZipModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      invalidText: ''
    }

    this.zipStore = this.props.store.zip
    this.modalStore = this.props.store.modal
  }

  handleSubmit(e) {
    if (!this.state.email) return

    if (!validateEmail(this.state.email)) {
      this.setState({invalidText: 'Email not valid'})
      return
    }

    this.zipStore.subscribe({email: this.state.email})
      .then(() => {
        this.modalStore.toggleInvalidZip()
        this.modalStore.toggleInvalidZipSuccess()
      }).catch((e) => {
        console.error('Failed to subscribe', e)
        const msg = e.response.data.error.message
        this.setState({invalidText: msg})
      })


    e.preventDefault()
  }

  render() {
    const store = this.props.store

    let buttonClass = 'btn btn-main'
    if (this.state.email) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={this.modalStore.invalidZip}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => store.modal.toggleInvalidZip(e)}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">Hope to be there soon!</h3>
            <span className="mb-5">Sign up to be notified once we are.</span>
            <form onSubmit={e => e.preventDefault()}>
              <Input
                className="aw-input--control aw-input--center aw-input--bordered mb-5"
                type="text"
                placeholder="Enter your email"
                onChange={(e) => this.setState({email: e.target.value})}/>
              <div>{ this.state.invalidText ? <span className="text-error text-center my-3">{this.state.invalidText}</span> : null}</div>
              <button className={buttonClass} onClick={(e) => this.handleSubmit(e)}>SUBMIT</button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InvalidZipModal);
