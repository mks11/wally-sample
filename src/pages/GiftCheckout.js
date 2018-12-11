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
      stripeToken: null,
      selectedPayment: null,
      lockPayment: false,
      guestUserPayment: null,
    }

    this.userStore = this.props.store.user
    this.checkoutStore = this.props.store.checkout
    this.routing = this.props.store.routing
  }


  componentDidMount() {
    ReactGA.pageview("/giftcard");

    this.handleGiftcardRedirect()

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

  handleGiftcardRedirect() {
    const queryParams = qs.parse(this.props.location.search)
    const { giftcard } = queryParams

    if (giftcard) {
      this.userStore.giftCardPromo = giftcard
      this.routing.push('/main')
    }
  }

  handleGiftCheckoutSubmit = data => {
    let finalData = data
    if (!data.payment_id) {
      finalData.stripeToken = this.state.stripeToken
    }

    this.userStore.purchaseGiftCard(finalData)
      .then(res => {
        if (res.success) {
          this.routing.push('/main')
        } else {
          this.setState({ purchaseFaild: 'Gift card purchase failed' })
        }
      })
      .catch(e => {
        const msg = !e.response.data.error ? 'Purchase failed' : e.response.data.error.message
        this.setState({ purchaseFaild: msg })
      })
  }

  handleAddPayment = data => {
    if (this.userStore.status) {
      this.userStore.savePayment(data).then((data) => {
        this.userStore.setUserData(data)
        this.setState({
          selectedPayment: this.userStore.user.preferred_payment,
        })
      })
    } else {
      const guestPayment = !this.userStore.status ? [{
        _id: 'guestuser_id',
        last4: data.last4,
      }] : null
  
      this.setState({
        stripeToken: data.stripeToken,
        guestUserPayment: guestPayment,
        selectedPayment: 'guestuser_id',
      })
    } 
  }

  render() {
    const { purchaseFaild, guestUserPayment, selectedPayment } = this.state
    const giftFrom = this.userStore.user && this.userStore.user.email || ''
    const userPayment = this.userStore.user && this.userStore.user.payment || guestUserPayment
    const userPreferredPayment = this.userStore.user && this.userStore.user.preferred_payment || null
    const userGuest = !this.userStore.status

    return (
      <div className="App">
        <Title content="Gift card" />
        <div className="container">
          <div className="gift-checkout-wrap card1 card-shadow">
            <h3>Get fresh with a Wally Shop gift card</h3>
            <p>Check our <Link to="/help/topics/5b92991899ddae0fb0f0a59f">available zip codes</Link> to be sure that your recipient is in an area that The Wally Shop operates.</p>
            <h3><FontAwesome name="gift" className="gift-icon" />Build Gift Card</h3>
            <GiftForm
              giftFrom={giftFrom}
              onSubmit={this.handleGiftCheckoutSubmit}
              onAddPayment={this.handleAddPayment}
              userPayment={userPayment}
              userPreferredPayment={userPreferredPayment}
              userGuest={userGuest}
              customErrorMsg={purchaseFaild}
              forceSelect={selectedPayment}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect("store")(GiftCheckout);
