import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'
import axios from 'axios'

class InviteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: ''
    }

    this.userStore = this.props.store.user
  }

  componentDidMount() {
    // if (!this.userStore.user) return
    //
    // this.userStore.referFriend().then((res) => {
    //   this.setState({link: res.data.ref_url})
    // }).catch((e) => {
    //   console.error('Failed to load refer friend', e)
    // })
  }

  handleCopy() {
    const $el = this.el
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
      <Modal isOpen={store.modal.invite} contentClassName="modal-bg-pinneapple">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => store.modal.toggleInvite(e)}></button>
        </div>
        <ModalBody >
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">Share the love!</h3>
            <span className="mb-5">
              Share the link below to give your
              friends free delivery their first month.    
            </span>
            <div className="referral-wrap p-2">
              <input type="text" style={{position: 'absolute', zIndex:-100}} value={this.state.link} ref={el => this.el = el}/>
              <span className="referral-link">{this.userStore.refUrl}</span>
              <button type="button" className="btn btn-transparent btn-transparent-light" onClick={e => this.handleCopy()}>COPY</button>
            </div>
          </div>

        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(InviteModal);
