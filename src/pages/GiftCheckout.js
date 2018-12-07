import React, { Component } from 'react';
import ReactGA from 'react-ga';
import qs from 'query-string'
import { Link } from 'react-router-dom'
import Title from '../common/page/Title'
import FontAwesome from 'react-fontawesome';
import GiftForm from './gift/GiftForm';

import { connect } from '../utils'

class GiftCheckout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPayment: null,
      lockPayment: false,
      newPayment: false,
    }

    this.userStore = this.props.store.user
    this.checkoutStore = this.props.store.checkout
    this.routing = this.props.store.routing
  }


  componentDidMount() {
    ReactGA.pageview("/giftcard");

    const queryParams = qs.parse(this.props.location.search)
    const { giftcard } = queryParams

    if (giftcard) {
      console.log(giftcard)
      this.routing.push('/')
    }

    this.userStore.getStatus(true)
      .then((status) => {
        if (status) {
          if (this.userStore.user.payment.length > 0) {
            const selectedPayment = this.userStore.user.payment.find((d) => d._id === this.userStore.user.preferred_payment)
            this.setState({selectedPayment: selectedPayment._id})
          }
        }
      })
  }

  handleGiftCheckoutSubmit = e => {
  }

  handleAddPayment = data => {
    return this.userStore.savePayment(data).then((data) => {
      this.userStore.setUserData(data)
      this.setState({
        selectedPayment: this.userStore.user.preferred_payment,
        newPayment: false
      })
      return data
    })
  }

  render() {
    const giftFrom = this.userStore.user && this.userStore.user.email || ''
    const userPayment = this.userStore.user && this.userStore.user.payment || null
    const userPreferredPayment = this.userStore.user && this.userStore.user.preferred_payment || null

    return (
      <div className="App">
        <Title content="Gift card" />
        <div className="container">
          <div className="gift-checkout-wrap card1 card-shadow">
            <h3>Get fresh with a Wally Shop gift card</h3>
            <p>Check our available zip codes to be sure that your recipient is in an area that The Wally Shop operates. Click <Link to="/help/topics/5b92991899ddae0fb0f0a59f">here</Link> for more.</p>
            <h3><FontAwesome name="gift" className="gift-icon" />Build Gift Card</h3>
            <GiftForm
              giftFrom={giftFrom}
              onSubmit={this.handleGiftCheckoutSubmit}
              onAddPayment={this.handleAddPayment}
              userPayment={userPayment}
              userPreferredPayment={userPreferredPayment}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect("store")(GiftCheckout);
