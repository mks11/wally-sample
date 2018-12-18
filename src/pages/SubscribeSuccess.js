import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from '../utils'

class SubscribeSuccess extends Component {
  constructor(props, context) {
    super(props, context);
    this.routing = this.props.store.routing

  }

  handleShopMore() {
    this.routing.push('/main')
  }

  render() {
     return (
      <section className="page-section">
          <div className="container-fluid">
            <h1 className="my-1">You have been subscribed!</h1>
            <p style={{fontSize:'25px'}}>Thanks for signing up! Keep an eye out for the latest news, recipes and sustainable tips in your inbox.</p>
            
            <div className="btn-hero--wrapper mb-3 mt-4">
              <button onClick={e => this.handleShopMore(e)} id="btn-hero--submit" href="#nav-hero" className="btn btn-block btn-success btn-get--started btn-left mr-4" data-submit="Submit">
                KEEP SHOPPING
              </button>
            </div>
        </div>
      </section>
    );
  }
}

export default connect("store")(SubscribeSuccess);
