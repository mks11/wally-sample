import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { connect, capitalizeFirstLetter } from '../../utils'
import moment from 'moment'

class ReportModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      invalidText: '',
      cart: null
    }

    this.orderStore = this.props.store.order
    this.userStore = this.props.store.user
  }

  handleSubmit(e) {
    if (!this.state.text) {
      this.setState({invalidText: 'Issue cannot be empty'})
      return
    }
    this.orderStore.submitIssue({
      message: this.state.text,
      issue_id: this.orderStore.activeOrder._id
    }, this.userStore.getHeaderAuth()).then((data) => {
      this.orderStore.toggleReport()
      this.orderStore.toggleReportSuccess()
    }).catch((e) => {
      console.error('Failed to submit issue', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      //this.orderStore.toggleReport()
    })
    e.preventDefault()
  }

  render() {
    let buttonClass='btn btn-main mt-3'
    if (this.state.text) {
      buttonClass += ' active'
    }

    const item = this.orderStore.activeOrder
    if (!item) {
      return null
    }


    return (
      <Modal isOpen={this.orderStore.reportModal}>
        <div className="modal-header">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.orderStore.toggleReport(e)}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="order-wrap pb-5">
            <h3 className="m-0 mb-2">Order Issue</h3>
            <span className="text-order mb-3">
              Order: #{item._id}<br/>
              {moment(item.delivery_time.substring(0,10)).format('MMM DD, YYYY')}<br/>
              {capitalizeFirstLetter(item.status.replace("_", " "))}
            </span><br/><br/>
            <span className="text-order text-bold mt-2">Describe your issue below:</span>
            <form onSubmit={e => e.preventDefault()}>
              <textarea
                rows="10"
                className="aw-input--control aw-input--left aw-input--bordered-strong p-2"
                onChange={(e) => this.setState({text: e.target.value})}>
            </textarea>
            <button onClick={e => this.handleSubmit(e)} className={buttonClass} style={{width: '80%'}}>SUBMIT</button>

            {this.state.invalidText && <span className="text-error text-center d-block mt-2">{this.state.invalidText}</span>}
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(ReportModal);
