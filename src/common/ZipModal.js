import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class ZipModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zip: ''
    }

    this.modalStore = this.props.store.modal
    this.zipStore = this.props.store.zip
  }

  componentDidMount() {
    this.zipStore.loadZipCodes().catch((e) => {
      console.error('Failed to load zipcodes: ', e)
    })
  }

  handleSubmit(e) {
    if (!this.state.zip) return

    this.modalStore.toggleZip()
    this.zipStore.selectedZip = this.state.zip
    if(this.zipStore.validateZipCode(this.state.zip)) {
      this.modalStore.toggleSignup()
    } else {
      this.modalStore.toggleInvalidZip()
    }
    this.setState({zip: ''})
    e.preventDefault()

  }

  handleToggle = () => {
    this.setState({zip: ''})
    this.modalStore.toggleZip()
  }

  handleZipEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  render() {
    const store = this.props.store

    let buttonClass = 'btn btn-main'
    if (this.state.zip) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={store.modal.zip} toggle={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <ModalBody>
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">What's your zipcode?</h3>
            <span className="mb-5">The Wally Shop is only available in select zipcodes.</span>
            <form onSubmit={e => e.preventDefault()}>
              <Input
                autoFocus
                className="aw-input--control aw-input--center mb-5"
                type="number"
                placeholder="Enter your zipcode"
                onKeyDown={this.handleZipEnter}
                onChange={(e) => this.setState({zip: e.target.value})}/>
              <button type="button" className={buttonClass} onClick={(e) => this.handleSubmit(e)}>SUBMIT</button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ZipModal);
