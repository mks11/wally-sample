import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { logPageView } from 'services/google-analytics';
import { connect, getItemsCount } from 'utils';

import CarbonBar from 'common/CarbonBar';
import Product from '../Mainpage/Product';
import EmptyCartMessage from './EmptyCartMessage';

class SimilarProducts extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.modalStore = this.props.store.modal;
    this.modalV2Store = this.props.store.modalV2;
    this.productStore = this.props.store.product;
    this.checkoutStore = this.props.store.checkout;
    this.zipStore = this.props.store.zip;

    this.state = {
      deliveryTimes: this.checkoutStore.deliveryTimes,
      sidebar: [],
      categoryTypeMode: 'limit',
      showMobileSearch: false,
    };

    this.id = this.props.match.params.id;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);

    this.userStore.getStatus(true).then((status) => {
      // this.checkoutStore.getDeliveryTimes();
      this.loadData();

      const { mainFirst } = this.userStore.flags || {};
      !mainFirst && this.modalStore.toggleModal('mainFirst');
    });
  }

  loadData() {
    const id = this.props.match.params.id;
    this.id = id;

    let categoryTypeMode = 'all';
    if (!this.id) {
      categoryTypeMode = 'limit';
    }

    this.setState({ categoryTypeMode });

    this.productStore.getAdvertisements();
    // this.productStore.getCategories();
    this.productStore
      .getImpulseProducts(this.userStore.getHeaderAuth())
      .then((data) => {
        this.setState({ sidebar: this.productStore.sidebar });
      })
      .catch((e) => console.error('Failed to load similar products: ', e));
  }

  render() {
    const items = this.checkoutStore.cart
      ? this.checkoutStore.cart.cart_items
      : [];
    const numCartItems = getItemsCount(items);

    return (
      <div className="App">
        {items.length < 1 ? (
          <div className="container">
            <EmptyCartMessage />
          </div>
        ) : (
          <>
            <div className="container">
              <div className="row justify-content-md-center mt-2">
                <div className="col col-lg-9">
                  <h1>Customers also bought:</h1>
                </div>
                <hr />
                <div className="col col-lg-3 similar-products-checkout">
                  <h3 className="text-right">
                    <Link to="/checkout" className="color-purple">
                      Continue To Checkout
                    </Link>
                  </h3>
                </div>
                <br />
              </div>
              <CarbonBar nCartItems={numCartItems} />
            </div>
            <div className="container">
              <div className="col-12">
                <div className="row">
                  {this.productStore.impulse_products
                    ? this.productStore.impulse_products.map((product) => (
                        <Product
                          key={product.product_id}
                          product={product}
                          deliveryTimes={this.state.deliveryTimes}
                        />
                      ))
                    : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default connect('store')(SimilarProducts);
