import React, { Component } from "react";
import { Link } from "react-router-dom";

import { logPageView } from "services/google-analytics";
import { connect, datesEqual } from "utils";

import CarbonBar from "common/CarbonBar";
import Product from "../Mainpage/Product";
import EmptyCartMessage from "./EmptyCartMessage";

class SimilarProducts extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.modalStore = this.props.store.modal;
    this.productStore = this.props.store.product;
    this.checkoutStore = this.props.store.checkout;
    this.zipStore = this.props.store.zip;

    this.state = {
      deliveryTimes: this.checkoutStore.deliveryTimes,
      sidebar: [],
      categoryTypeMode: "limit",
      showMobileSearch: false,
    };

    this.id = this.props.match.params.id;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);

    this.userStore.getStatus(true).then((status) => {
      this.userStore.giftCardPromo && this.processGiftCardPromo(status);
      this.checkoutStore.getDeliveryTimes();
      this.loadData();

      const { mainFirst } = this.userStore.flags || {};
      !mainFirst && this.modalStore.toggleModal("mainFirst");
    });
  }

  loadData() {
    const id = this.props.match.params.id;
    this.id = id;

    let categoryTypeMode = "all";
    if (!this.id) {
      categoryTypeMode = "limit";
    }

    this.setState({ categoryTypeMode });

    const deliveryData = this.userStore.getDeliveryParams();

    this.productStore.getAdvertisements();
    this.productStore.getCategories();
    this.productStore
      .getImpulseProducts(this.userStore.getHeaderAuth())
      .then((data) => {
        this.setState({ sidebar: this.productStore.sidebar });
      })
      .catch((e) => console.error("Failed to load similar products: ", e));

    this.checkoutStore
      .getCurrentCart(this.userStore.getHeaderAuth(), deliveryData)
      .then((data) => {
        if (
          !datesEqual(data.delivery_date, deliveryData.date) &&
          deliveryData.date !== null
        ) {
          this.checkoutStore.getDeliveryTimes().then(() => {
            if (
              !this.userStore.status ||
              (this.userStore.status && !this.userStore.user.is_ecomm)
            ) {
              this.modalStore.toggleDelivery();
            }
          });
        }

        data &&
          this.userStore.adjustDeliveryTimes(
            data.delivery_date,
            this.state.deliveryTimes
          );

        if (this.userStore.cameFromCartUrl) {
          if (
            !this.userStore.status ||
            (this.userStore.status && !this.userStore.user.is_ecomm)
          ) {
            const delivery = this.userStore.getDeliveryParams();
            if (delivery.zip && delivery.date) {
              this.checkoutStore.updateCartItems(delivery);
              this.userStore.cameFromCartUrl = false;
            } else {
              if (
                !this.userStore.status ||
                (this.userStore.status && !this.userStore.user.is_ecomm)
              ) {
                this.modalStore.toggleDelivery();
              }
            }
          }
        }
      })
      .catch((e) => {
        console.error("Failed to load current cart", e);
      });
  }

  processGiftCardPromo(userStatus) {
    if (userStatus) {
      this.checkoutStore
        .checkPromo(
          { promoCode: this.userStore.giftCardPromo },
          this.userStore.getHeaderAuth()
        )
        .then((data) => {
          let msg = "";
          if (data.valid) {
            msg = "Store Credit Redeemed";
            this.userStore.getUser().then(() => {
              this.loadData();
            });
          } else {
            msg = "Invalid Promo-code";
          }
          this.modalStore.toggleModal("referralresult", msg);
          this.userStore.giftCardPromo = null;
        })
        .catch((e) => {
          const msg = !e.response.data.error
            ? "Check Promo failed"
            : e.response.data.error.message;
          this.modalStore.toggleModal("referralresult", msg);
          this.userStore.giftCardPromo = null;
        });
    } else {
      this.modalStore.toggleModal("login");
    }
  }

  handleProductModal = (product_id, deliveryTimes) => {
    this.productStore
      .showModal(product_id, null, this.userStore.getDeliveryParams())
      .then((data) => {
        this.userStore.adjustDeliveryTimes(data.delivery_date, deliveryTimes);
        this.modalStore.toggleModal("product");
      });
  };

  render() {
    const cartItems = this.checkoutStore.cart
      ? this.checkoutStore.cart.cart_items
      : [];

    return (
      <div className="App">
        {cartItems.length < 1 ? (
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
              <CarbonBar value={cartItems.length % 10} />
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
                          onProductClick={this.handleProductModal}
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

export default connect("store")(SimilarProducts);
