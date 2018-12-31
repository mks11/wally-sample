import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../utils'

import WelcomeModal from './WelcomeModal'
import ZipModal from './ZipModal'
import SignupModal from './SignupModal'
import LoginModal from './LoginModal'
import ReferralModal from './ReferralModal'
import FeedbackModal from './FeedbackModal'
import ReferralResultModal from './ReferralResultModal'
import InviteModal from './InviteModal'
import InvalidZipModal from './InvalidZipModal'
import InvalidZipSuccessModal from './InvalidZipSuccessModal'
import DeleteModal from './DeleteModal'
import ProductModal from './ProductModal'
import DeliveryModal from './DeliveryModal'

const ModalRoutes = {
  welcome: WelcomeModal,
  zip: ZipModal,
  invalidzip: InvalidZipModal,
  invalidzipsuccess: InvalidZipSuccessModal,
  signup: SignupModal,
  login: LoginModal,
  referral: ReferralModal,
  feedback: FeedbackModal,
  referralresult: ReferralResultModal,
  invite: InviteModal,
  delete: DeleteModal,
  product: ProductModal,
  delivery: DeliveryModal,
}

class RootModal extends Component {
  constructor(props) {
    super(props)
    this.modalStore = this.props.store.modal
  }

  toggleModal = e => {
    this.modalStore.toggleModal()
    e && e.preventDefault()
  }

  switchModal = modalId => {
    this.modalStore.switchModal(modalId)
  }

  renderEmpty = () => (null)

  render() {
    const {
      isOpen,
      modalId,
    } = this.modalStore

    const ModalToRender = ModalRoutes[modalId] || this.renderEmpty
    
    // temporary hack 
    const isLarge = modalId === 'product'

    return (
      <Modal
        autoFocus={false}
        isOpen={isOpen}
        contentClassName="modal-bg-pinneapple-bottom"
        centered
        size={isLarge ? 'lg' : ''}
      >
        <ModalBody>
          <button className="btn-icon btn-icon--close" onClick={this.toggleModal}></button>
          <ModalToRender
            stores={this.props.store}
            toggle={this.toggleModal}
            switchTo={this.switchModal}
          />
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(RootModal);
