import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from '../utils';

import WelcomeModal from './WelcomeModal';
import ZipModal from './ZipModal';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ReferralModal from './ReferralModal';
import FeedbackModal from './FeedbackModal';
import ServiceFeedbackModal from './ServiceFeedbackModal';
import ReferralResultModal from './ReferralResultModal';
import InviteModal from './InviteModal';
import InvalidZipModal from './InvalidZipModal';
import InvalidZipSuccessModal from './InvalidZipSuccessModal';
import DeleteModal from './DeleteModal';
import ProductModal from './ProductModal';
import DeliveryModal from './DeliveryModal';
import CheckoutFirstModal from './CheckoutFirstModal';
import MainFirstModal from './MainFirstModal';
import MainSecondModal from './MainSecondModal';
import ModalError from './ModalError';
import WaitingListModal from './WaitingListModal';
import EmailVerification from './EmailVerification';
import JoinWaitlistModal from './JoinWaitlistModal';
import RedeemDepositModal from './RedeemDepositModal';
import PackagingDepositModal from './PackagingDepositModal';
import AddressUpdateModal from './AddressUpdate';
import AddressDeleteModal from './AddressDelete';
import SuccessModal from './SuccessModal';
import ReportIssueModal from './ReportIssueModal';

const ModalRoutes = {
  welcome: WelcomeModal,
  zip: ZipModal,
  invalidzip: InvalidZipModal,
  invalidzipsuccess: InvalidZipSuccessModal,
  signup: SignupModal,
  login: LoginModal,
  referral: ReferralModal,
  feedback: FeedbackModal,
  servicefeedback: ServiceFeedbackModal,
  referralresult: ReferralResultModal,
  invite: InviteModal,
  delete: DeleteModal,
  product: ProductModal,
  delivery: DeliveryModal,
  checkoutfirst: CheckoutFirstModal,
  mainFirst: MainFirstModal,
  mainSecond: MainSecondModal,
  error: ModalError,
  waitinglist: WaitingListModal,
  emailverification: EmailVerification,
  joinwaitlist: JoinWaitlistModal,
  redeemdeposit: RedeemDepositModal,
  packagingdeposit: PackagingDepositModal,
  success: SuccessModal,
  reportIssue: ReportIssueModal,
  addressUpdate: AddressUpdateModal,
  addressDelete: AddressDeleteModal,
};

class RootModal extends Component {
  constructor(props) {
    super(props);
    this.modalStore = this.props.store.modal;
  }

  toggleModal = (e) => {
    this.modalStore.modalPull.shift();

    if (this.modalStore.modalPull.length) {
      const modalId = this.modalStore.modalPull[0];
      this.switchModal(modalId);
    } else {
      this.modalStore.toggleModal();
    }

    e && e.preventDefault && e.preventDefault();
  };

  switchModal = (modalId) => {
    this.modalStore.switchModal(modalId);
  };

  renderEmpty = () => null;

  render() {
    const { isOpen, modalId } = this.modalStore;

    const ModalToRender = ModalRoutes[modalId] || this.renderEmpty;

    // temporary hack
    const isLarge = modalId === 'product';
    const withGradient = modalId === 'waitinglist';

    return (
      <Modal
        autoFocus={false}
        isOpen={isOpen}
        centered
        size={isLarge ? 'lg' : ''}
      >
        <ModalBody className={`${withGradient ? 'waitinglist-modal' : ''}`}>
          <button
            className="btn-icon btn-icon--close"
            onClick={this.toggleModal}
          ></button>
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

export default connect('store')(RootModal);
