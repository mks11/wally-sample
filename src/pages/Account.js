import React, { Component } from 'react';
import { Input  } from 'reactstrap'
import Title from '../common/page/Title'
import AddressModal from './account/AddressModal'
import PaymentModal from './account/PaymentModal'

import { connect } from '../utils'

class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      telephone: '',
      email: '',
      editName: true,
      editTelephone: true,
    }


    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal

  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        if (!status) {
          // this.modalStore.toggleLogin()
          this.props.store.routing.push('/')
        } else {
          const user = this.userStore.user
          this.setState({name: user.name,telephone: user.primary_telephone, email: user.email})
        }

      })
  }

  toggleEditName(s) {
    this.setState({editName: s})
    if (this.state.editName) {
      const $el = window.$('#inputName')
      $el.focus()
    }
  }

  toggleEditTelephone(s) {
    this.setState({editTelephone: s})
    if (this.state.editTelephone) {
      const $el = window.$('#inputTelephone')
      $el.focus()
    }
  }

  edit() {
    this.userStore.edit({
      name: this.state.name,
      telephone: this.state.telephone
    }).then((data) => {
      this.userStore.setUserData(data)
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to delete address', e)
    })
  }

  updateName(e) {
    this.edit()
    this.toggleEditName(true)
  }

  updateTelephone(e) {
    this.edit()
    this.toggleEditTelephone(true)
  }


  render() {
    if (!this.userStore.user) return null

    const name = this.state.name
    const telephone = this.state.telephone ? this.state.telephone : ''

    const addresses = this.userStore.user.addresses
    const payments = this.userStore.user.payment
      
    return (
      <div className="App">
        <Title content="Account" />

        <section className="page-section aw-account--details pt-1">
          <div className="container">
            <h2>Account Details</h2>
            <form autoComplete="off">
              <div className="aw-input--group">
                <Input
                  className="aw-input--control aw-input--control-large aw-input--left"
                  type="text"
                  readOnly={this.state.editName}
                  placeholder="Enter your name"
                  id="inputName"
                  value={name}
                  onChange={(e) => this.setState({name: e.target.value})}/>
                { this.state.editName ? <button type="button" className="btn btn-transparent" onClick={e => this.toggleEditName(false)}>EDIT</button> : null }
                { !this.state.editName ? <button type="button" className="btn btn-transparent" onClick={e => this.updateName(e)}>SAVE</button> : null }
              </div>
              <div className="aw-input--group">
              <Input
                className="aw-input--control aw-input--control-large aw-input--left"
                type="text"
                readOnly={this.state.editTelephone}
                id="inputTelephone"
                placeholder="Enter your phone number"
                value={telephone}
                onChange={(e) => this.setState({telephone: e.target.value})}/>
                { this.state.editTelephone ? <button type="button" className="btn btn-transparent" onClick={e => this.toggleEditTelephone(false)}>EDIT</button> : null }
                { !this.state.editTelephone ? <button type="button" className="btn btn-transparent" onClick={e => this.updateTelephone(e)}>SAVE</button> : null }
              </div>
              <Input
                className="aw-input--control aw-input--control-large aw-input--left"
                type="text"
                readOnly={true}
                value={this.state.email}
                placeholder="Enter your email address"
                />
            </form>
          </div>
        </section>

        <section className="page-section aw-account--address pt-2">
          <div className="container">
            <h2>Addresses</h2>
              <ul className="list-addresses">
              {addresses.map((data, index) => (
                  <li key={index}>
                    <span className="addresses--address">{data.street_address} {data.unit}, {data.state} {data.zip}</span>
                    <span className="addresses--info">{data.name}</span>
                    <span className="addresses--info">{data.telephone}</span>
                      <span className="addresses--default button">
                        {data.address_id === this.userStore.user.preferred_address ? (
                          <span onClick={e => this.userStore.showAddressModal(data)}>DEFAULT</span>
                        ): null}
                        <i className="ico ico-arrow-right ml-3 button" onClick={e => this.userStore.showAddressModal(data)}></i>
                      </span>
                </li>
              ))}
              </ul>
              <button className="btn btn-icon-transparent mt-4" onClick={e => this.userStore.showAddressModal()}><i className="ico ico-add-circle mr-3"></i>Add new address</button>
          </div>
        </section>

        <section className="page-section aw-account--payment pt-2">
          <div className="container">
            <h2>Payment</h2>
            <ul className="list-payments">
              {payments.map((data, index) => (
                <li key={index}>
                  <span className="payments--card">*****{data.last4}</span>
                      <span className="addresses--default button">
                        {data.payment_id === this.userStore.user.preferred_payment ? (
                          <span onClick={e => this.userStore.showPaymentModal(data)}>DEFAULT</span>
                        ): null}
                        <i className="ico ico-arrow-right ml-3 button" onClick={e => this.userStore.showPaymentModal(data)}></i>
                      </span>
                </li>
              ))}
            </ul>
            <button onClick={e=>this.userStore.showPaymentModal()} className="btn btn-icon-transparent btn-block mt-4"><i className="ico ico-add-square mr-3"></i>Add new card</button>
            <button className="btn btn-icon-transparent btn-block mt-4"><i className="ico ico-add-square mr-3"></i>Add promo or gift card</button>
          </div>
        </section>
        { this.userStore.addressModalOpen ? <AddressModal/> : null }
        { this.userStore.paymentModalOpen ? <PaymentModal/> : null }
      </div>
    );
  }
}

export default connect("store")(Account);
