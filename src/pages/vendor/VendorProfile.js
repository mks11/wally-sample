import React, { Component } from 'react';

import { logPageView } from 'services/google-analytics';
import { connect } from 'utils';

import Product from '../Mainpage/Product';

class VendorProfile extends Component {
  constructor(props) {
    super(props);

    this.productStore = this.props.store.product;
  }

  render() {
    return <div>foo</div>;
  }
}

export default connect('store')(VendorProfile);
