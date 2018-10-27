import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../utils'

class InviteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: ''
    }

    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
  }

  handleToggle = () => {
    this.modalStore.toggleInvite()
  }

  handleCopy = () => {
    const $el = this.el
    console.log($el)
    $el.select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successfully' : 'unsuccessfully'
      console.log('text coppied ' + msg)
    } catch (err) {
      console.log('Unable to copy text')
    }
  }

  render() {
    const store = this.props.store
    return (
      <Modal isOpen={store.modal.invite} contentClassName="modal-bg-pinneapple" toggle={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">Who wants brownie points?</h3>
            <span className="mb-5">
              Share the link below to give your friends free delivery their first month. 
            </span>
            <div className="referral-wrap p-2">
              <input type="text" style={{position: 'absolute', zIndex:-100}} value={this.userStore.refUrl} ref={el => this.el = el}/>
              <span className="referral-link">{this.userStore.refUrl}</span>
              <button type="button" className="btn btn-transparent btn-transparent-light" onClick={this.handleCopy}>COPY</button>
            </div>
          </div>

        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InviteModal);
