import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../../utils'

class PromoModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      promoCode: '',
      invalidText: ''
    }

    this.userStore = this.props.store.user
  }

  componentDidMount() {
  }

  handleSubmit(e) {
    if (!this.state.promoCode) {
      this.setState({invalidText: 'Promo code cannot be empty'})
      return
    }

    this.userStore.addPromo(this.state.promoCode).then((data) => {
      if (data.valid) {
        // this.setState({appliedPromo: true, appliedPromoCode: promoCode, successText: 'Promo applied successfully'})
        // this.userStore.getUser().then(() => {
        //   this.loadData()
        // })
        this.userStore.togglePromoSuccessModal()
      } else {
        this.setState({invalidText: 'Invalid promo code'})
      }

      this.setState({promoCode: ''})
    }).catch((e) => {
      if (!e.response.data.error) {
        this.setState({invalidText: 'Check promo failed'})
        return
      }
      console.error('Failed to check promo', e)
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
    })

    e.preventDefault()
  }

  handleToggle = () => {
    this.setState({promoCode: ''})
    this.userStore.togglePromoModal()
  }

  handlePromoEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e)
    }
  }

  render() {

    let buttonClass = 'btn btn-main'
    if (this.state.promoCode) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={this.userStore.promoModal} toggle={this.handleToggle}>
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.handleToggle}></button>
        </div>
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">What's your promo code?</h3>
            <span className="mb-5">Please input your promo code</span>
            <form onSubmit={e => e.preventDefault()}>
              <Input
                autoFocus
                className="aw-input--control aw-input--center mb-5"
                type="text"
                placeholder="Enter your promocode"
                onKeyDown={this.handlePromoEnter}
                value={this.state.promoCode}
                onChange={(e) => this.setState({promoCode: e.target.value})}/>
              <button type="button" className={buttonClass} onClick={(e) => this.handleSubmit(e)}>SUBMIT</button>

              <div>{ this.state.invalidText && <span className="text-error text-center my-3">{this.state.invalidText}</span>}</div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(PromoModal);
