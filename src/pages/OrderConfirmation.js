import React, { Component } from 'react';
import { Button, FormGroup, Input, ControlLabel, HelpBlock } from 'reactstrap';
import { connect } from '../utils'


class OrderConfirmation extends Component {
  constructor(props, context) {
    super(props, context);
    this.routing = this.props.store.routing

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
      <button onClick={e => this.handleShopMore(e)} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started btn-left mb-3 mt-4" data-submit="Submit">
        KEEP SHOPPING
      </button>
    </div>
      </section>
    );
  }
}

export default connect("store")(OrderConfirmation);
