import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../../utils'

class ReportModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }

    this.modalStore = this.props.store.modal
  }

  handleSubmit(e) {
    this.modalStore.toggleReport()
    e.preventDefault()
  }
  render() {
    const store = this.props.store
    let buttonClass='btn btn-main mt-3'
    if (this.state.text) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={store.modal.report}>
        <div className="modal-header">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => store.modal.toggleReport(e)}></button>
        </div>
        <ModalBody>
          <div className="order-wrap pb-5">
            <h3 className="m-0 mb-2">Order Issue</h3>
            <span className="text-order mb-3">
              Order: #245993<br/>
              May 07,2018<br/>
              Delivered
            </span><br/><br/>
            <span className="text-order text-bold mt-2">Describe your issue bellow:</span>
            <form onSubmit={e => e.preventDefault()}>
              <textarea
                rows="10"
                className="aw-input--control aw-input--left aw-input--bordered-strong p-2"
                onChange={(e) => this.setState({text: e.target.value})}>
            </textarea>
            <button onClick={e => this.handleSubmit(e)} className={buttonClass} style={{width: '80%'}}>SUBMIT</button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ReportModal);
