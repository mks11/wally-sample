import React, { Component } from "react";
import ReactGA from "react-ga";
import {
  connect,
  logModalView,
  datesEqual
} from "utils";

import Product from "../Mainpage/Product";

class VendorProfile extends Component {
  constructor(props) {
    super(props);

    this.vendorProfileStore = this.props.store.vendor;
    this.vendorProfileStore = this.props.store.products;

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.modalStore = this.props.store.modal;
    this.productStore = this.props.store.product;
    this.checkoutStore = this.props.store.checkout;
    this.zipStore = this.props.store.zip;

    this.state = {
      deliveryTimes: this.checkoutStore.deliveryTimes,
    };

    this.id = this.props.match.params.id;
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus(true).then(status => {
      this.userStore.giftCardPromo && this.processGiftCardPromo(status);
      this.checkoutStore.getDeliveryTimes();
      this.loadData();

      const { mainFirst } = this.userStore.flags || {};
      !mainFirst && this.modalStore.toggleModal("mainFirst");
    });
  }

  loadData() {
    const name = this.props.match.params.vendor_name;

    this.vendorProfileStore.loadVendorProfile(name)
      .catch(e => {
        console.error("Failed to load vendor profile", e);
        this.modalStore.toggleModal("error");
      });

    const deliveryData = this.userStore.getDeliveryParams();

    this.productStore.getAdvertisements();
    this.productStore.getCategories();

    this.checkoutStore
      .getCurrentCart(this.userStore.getHeaderAuth(), deliveryData)
      .then(data => {
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
      .catch(e => {
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
        .then(data => {
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
        .catch(e => {
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
      .then(data => {
        this.userStore.adjustDeliveryTimes(
          data.delivery_date,
          deliveryTimes
        );
        this.modalStore.toggleModal("product");
      })
  };

  render() {
    const vendor = this.vendorProfileStore.vendor;

    return (
      <div className="App">
        {vendor ? (
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-6 col-xs-12">
                <img src={vendor.logo_url} alt="" />
              </div>

              <div className="col-md-6 col-xs-12 text-left">
                <h1>{vendor.name}</h1>
                {vendor.city === null && (
                  <h2>
                    {vendor.city} | {vendor.state}
                  </h2>
                )}
                <hr />
                <p>{vendor.description}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="container">
          <div className="col-md-10 col-sm-8">
            <div className="row">
            {
              this.vendorProfileStore.products
                ? this.vendorProfileStore.products
                    .map(product => (
                      <Product
                        key={product.product_id}
                        product={product}
                        deliveryTimes={this.state.deliveryTimes}
                        onProductClick={this.handleProductModal}
                      />
                    ))
                : null
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect("store")(VendorProfile);
