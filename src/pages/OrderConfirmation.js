import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect, logEvent, logModalView, logPageView } from '../utils';
import ReactGA from 'react-ga';

class OrderConfirmation extends Component {
  constructor(props) {
    super(props)

    this.routing = this.props.store.routing
    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
  }

  componentDidMount() {
    logModalView('/refer');
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus(true)
      .then((status) => {
        if (status) {
          this.modalStore.toggleModal('referral')
        } else {
          this.routing.push('/main')
        }
      })
  }

  handleShopMore() {
    this.routing.push('/main')
  }

  render() {
    const id = this.props.match.params.id
    if (!id) {
      return null
    }
     return (
      <section className="page-section">
          <div className="container-fluid">
            <h1 className="my-1">Your order has been placed!</h1>
            <h1 className="my-1 mt-4">Order ID: #{id}</h1>
            <p style={{fontSize:'25px'}}>Thank you for your order! You should receive an order confirmation email shortly. When you’re finished with any Wally Shop containers or bags, simply return them to the courier upon your next, or any future, Wally Shop delivery.</p>
            
            <div className="btn-hero--wrapper mb-3 mt-4">
              <button onClick={e => this.handleShopMore(e)} id="btn-hero--submit" href="#nav-hero" className="btn btn-block btn-success btn-get--started btn-left mr-4 confirm-submit" data-submit="Submit">
                KEEP SHOPPING
              </button>
              <span>
                For every friend you refer, you’ll get 15% off for a month once they purchase, and they’ll get 15% off their first month as well. Details <Link to="/help/detail/5bd1d6c31ee5e4f1d0b42c29">here.</Link>
              </span>
            </div>
        </div>
      </section>
    );
  }
}

export default connect("store")(OrderConfirmation);
