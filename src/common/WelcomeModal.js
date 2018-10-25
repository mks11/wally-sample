import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class ZipModal extends Component {
  constructor(props) {
    super(props)

    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  componentDidMount() {
  }

  handleStart(e) {
    this.routing.push('/main')
    this.modalStore.toggleWelcome()
    
    e.preventDefault()

  }

  render() {
    return (
      <Modal isOpen={this.modalStore.welcome} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.modalStore.toggleWelcome(e)}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">Welcome to The Wally Shop</h3>
            <p className="mb-5">
              Enjoy the freshest groceries, at bulk prices, completely package-free.
              <br/>
              <br/>
              Ready to start shopping?
            </p>
            <button className="btn btn-main active" onClick={e => this.handleStart(e)}>START SHOPPING</button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ZipModal);
