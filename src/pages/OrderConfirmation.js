import React, { Component } from 'react';
import { Button, FormGroup, Input, ControlLabel, HelpBlock } from 'reactstrap';
import { connect } from '../utils'


class OrderConfirmation extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleShopMore() {

  }

  render() {
     return (
      <section className="page-section">
          <div className="container-fluid">
        <h1 className="my-1">Your order has been placed!</h1>
        <h1 className="my-1">Order ID: #123456</h1>
        <p style={{fontSize:'25px'}}>Thank you your order has been placed, you should be recieving a confirmation email shortly.
Don’t forget, when you are done with a container just simply return it upon the next or any 
future deliveries from the wally shop.</p>
      <button onClick={e => this.handleShopMore(e)} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started btn-left mb-3" data-submit="Submit">
        SHOP SOME MORE
      </button>
    </div>
      </section>
    );
  }
}

export default connect("store")(OrderConfirmation);
