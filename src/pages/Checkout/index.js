import React, { Component } from "react";
import ReactGA from "react-ga";
import moment from "moment";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";
import CurrencyInput from "react-currency-input";
import Title from "common/page/Title";
import PaymentSelect from "common/PaymentSelect";
import AmountGroup from "common/AmountGroup";

import {
  connect,
  formatMoney,
  logEvent,
  logModalView,
  logPageView,
  datesEqual
} from "utils";

import DeliveryTimeOptions from "common/DeliveryTimeOptions";
import DeliveryAddressOptions from "common/DeliveryAddressOptions";
import DeliveryChangeModal from "common/DeliveryChangeModal";

import Notes from "./Notes";
import ServiceSummary from "./ServiceSummary";
import PackagingSummary from "./PackagingSummary";
import TippingSummary from "./TippingSummary";
import PromoSummary from "./PromoSummary";
import Returns from "./Returns";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.modalStore = this.props.store.modal;
    this.productStore = this.props.store.product;
    this.checkoutStore = this.props.store.checkout;
    this.routing = this.props.store.routing;

    this.state = {
      timeDropdown: false,

      appliedStoreCredit: false,
      appliedStoreCreditAmount: 0,
      applicableStoreCreditAmount: 0,

      appliedPromo: false,

      appliedTipAmount: 0,
      appliedTipAmountChanged: false,
      tipReadOnly: true,
      tipApplyEdited: false,
      freezedTipAmount: null,

      selectedAddress: null,
      selectedPayment: null,
      selectedDay: null,
      selectedDate: null,
      selectedTime: null,

      lockAddress: true,
      lockPayment: false,
      lockTime: false,
      confirmHome: false,
      confirmHomeError: false,

      newAddress: false,
      newPayment: false,

      addressError: false,

      invalidText: "",
      successText: "",
      invalidSelectAddress: "",

      invalidAddressText: "",
      newStreetAddress: "",
      newAptNo: "",
      newZip: "",
      newContactName: "",
      newPhoneNumber: "",
      newDeliveryNotes: "",
      newState: "",
      newCity: "",
      newCountry: "",
      newPreferedAddress: false,

      deliveryTimes: this.checkoutStore.deliveryTimes,

      placeOrderRequest: false,

      order_notes: "",
      allergy_notes: "",
      hasReturns: false,
      pickupNotes: ""
    };
  }

  componentDidMount() {
    ReactGA.pageview("/checkout");
    this.userStore.getStatus(true).then(status => {
      if (status) {
        const selectedAddress =
          this.userStore.selectedDeliveryAddress ||
          (this.userStore.user
            ? this.userStore.getAddressById(
                this.userStore.user.preferred_address
              )
            : null);
        if (selectedAddress) {
          this.userStore.setDeliveryAddress(selectedAddress);
        }

        this.checkoutStore.getDeliveryTimes();
        this.loadData();
        if (this.userStore.user.addresses.length > 0) {
          const selectedAddress = this.userStore.user.addresses.find(
            d => d._id === this.userStore.user.preferred_address
          );
          this.setState({ selectedAddress: selectedAddress._id });
        } else {
          this.setState({ lockAddress: false });
        }

        if (this.userStore.user.payment.length > 0) {
          const selectedPayment = this.userStore.user.payment.find(
            d => d._id === this.userStore.user.preferred_payment
          );
          this.setState({ selectedPayment: selectedPayment._id });
        }

        const { checkoutFirst } = this.userStore.flags || {};
        !checkoutFirst && this.modalStore.toggleModal("checkoutfirst");
      } else {
        this.routing.push("/main");
      }
    });
  }

  loadData() {
    let dataOrder;
    const deliveryData = this.userStore.getDeliveryParams();
    const address_id = this.userStore.selectedDeliveryAddress.address_id;
    const tip = this.parseAppliedTip();
    this.checkoutStore
      .getOrderSummary(
        this.userStore.getHeaderAuth(),
        deliveryData,
        tip,
        address_id
      )
      .then(data => {
        this.setState({
          applicableStoreCreditAmount: this.checkoutStore.order
            .applicable_store_credit,
          appliedPromo: this.checkoutStore.order.promo_amount,
          appliedPromoCode: this.checkoutStore.order.promo
        });

        dataOrder = data;
        return data;
      })
      .then(data => {
        if (
          !datesEqual(data.delivery_date, deliveryData.date) &&
          deliveryData.date !== null
        ) {
          return this.checkoutStore.getDeliveryTimes().then(() => {
            this.userStore.adjustDeliveryTimes(
              dataOrder.delivery_date,
              this.state.deliveryTimes
            );
            this.setState({ invalidText: "Please select delivery time" });
          });
        }
        return null;
      })
      .catch(e => {
        console.error(e);
      });
  }

  updateData() {
    const deliveryData = this.userStore.getDeliveryParams();
    const tip = this.parseAppliedTip();
    const address_id = this.userStore.selectedDeliveryAddress.address_id;
    this.checkoutStore
      .getOrderSummary(
        this.userStore.getHeaderAuth(),
        deliveryData,
        tip,
        address_id
      )
      .then(data => {
        this.setState({
          applicableStoreCreditAmount: this.checkoutStore.order
            .applicable_store_credit,
          appliedPromo: this.checkoutStore.order.promo_amount,
          appliedPromoCode: this.checkoutStore.order.promo,
          appliedTipAmount: this.checkoutStore.order.tip_amount / 100
        });
      });
  }

  parseAppliedTip() {
    const { appliedTipAmount } = this.state;
    let tipValue = appliedTipAmount;

    if (typeof appliedTipAmount === "string") {
      tipValue = appliedTipAmount.replace("$", "");
    }

    return (parseFloat(tipValue) * 100).toFixed();
  }

  applyStoreCredit() {
    if (this.state.applicableStoreCreditAmount) {
      this.setState({
        appliedStoreCredit: true,
        appliedStoreCreditAmount: this.checkoutStore.order
          .applicable_store_credit
      });
      this.checkoutStore.order.total =
        this.checkoutStore.order.total -
        this.checkoutStore.order.applicable_store_credit;
    }
  }

  handleSelectAddress = data => {
    const selectedAddress = this.userStore.selectedDeliveryAddress;
    if (!selectedAddress || selectedAddress.address_id !== data.address_id) {
      this.setState({ selectedAddress: data, selectedAddressChanged: true });
      this.userStore.setDeliveryAddress(data);
    } else {
      this.setState({ selectedAddressChanged: false });
    }
  };
  handleAddNewAddress = async data => {
    const {
      newContactName,
      newState,
      newDeliveryNotes,
      newZip,
      newAptNo,
      newCity,
      newCountry,
      newPhoneNumber,
      newStreetAddress,
      newPreferedAddress
    } = data;

    const dataMap = {
      name: newContactName,
      state: newState,
      delivery_notes: newDeliveryNotes,
      zip: newZip,
      unit: newAptNo,
      city: newCity,
      country: newCountry,
      telephone: newPhoneNumber,
      street_address: newStreetAddress,
      preferred_address: newPreferedAddress
    };

    const response = await this.userStore.saveAddress(dataMap);
    const address = this.userStore.selectedDeliveryAddress;
    this.userStore.setDeliveryAddress(address);
    this.setState({ lockAddress: true });
    return response;
  };

  //Workin Here
  handleSubmitAddress = async address => {
    this.userStore.setDeliveryAddress(address);
    this.setState({ lockAddress: true });
  };

  handleUnlockAddress = () => {
    this.setState({ lockAddress: false });
  };

  handleSubmitPayment = (lock, selectedPayment) => {
    logEvent({ category: "Checkout", action: "SubmitPayment" });
    this.setState({
      selectedPayment,
      lockPayment: lock
    });
  };

  handleSelectTime = selectedTime => {
    this.modalStore.showDeliveryChange("time", selectedTime);
    this.setState({ invalidText: "" });
  };

  handleChangeDelivery = () => {
    this.updateData();
  };

  handleEdit(id, quantity) {
    this.productStore
      .showModal(id, quantity, this.userStore.getDeliveryParams())
      .then(() => {
        this.modalStore.toggleModal("product");
      });
  }

  handleDelete(data) {
    const id = {
      product_id: data.product_id,
      inventory_id: data.inventory[0]._id
    };
    this.modalStore.toggleModal("delete", id);
  }

  handlePlaceOrder() {
    const { placeOrderRequest, order_notes, allergy_notes } = this.state;

    if (placeOrderRequest) {
      return;
    }

    this.setState({ invalidText: "", placeOrderRequest: true });
    if (!this.userStore.selectedDeliveryAddress) {
      this.setState({
        invalidText: "Please select address",
        placeOrderRequest: false
      });
      return;
    }

    if (!this.userStore.selectedDeliveryTime && !this.userStore.is_ecomm) {
      this.setState({
        invalidText: "Please select delivery time",
        placeOrderRequest: false
      });
      return;
    }

    if (!this.state.confirmHome && !this.userStore.is_ecomm) {
      this.setState({
        invalidText: "Please confirm that you will be home",
        placeOrderRequest: false,
        confirmHomeError: true
      });
      return;
    }
    if (!this.state.lockPayment && !this.userStore.is_ecomm) {
      this.setState({
        invalidText: "Please select payment",
        placeOrderRequest: false
      });
      return;
    }
    logEvent({ category: "Checkout", action: "ConfirmCheckout" });
    let deliveryTime;
    if (!this.userStore.is_ecomm) {
      deliveryTime =
        this.userStore.selectedDeliveryTime.date +
        " " +
        this.userStore.selectedDeliveryTime.time;
    } else {
      deliveryTime = "UPS Ground (1-5 Days)";
    }

    this.checkoutStore
      .submitOrder(
        {
          store_credit: this.state.appliedStoreCreditAmount > 0,
          user_time: moment().format("YYYY-MM-DD HH:mm:ss"),
          address_id: this.userStore.selectedDeliveryAddress.address_id,
          payment_id: this.state.selectedPayment,
          delivery_time: deliveryTime,
          tip_amount: this.parseAppliedTip(),
          order_notes,
          allergy_notes,
          has_returns: this.state.hasReturns,
          pickup_notes: this.state.pickupNotes
        },
        this.userStore.getHeaderAuth()
      )
      .then(data => {
        ReactGA.event({
          category: "Order",
          action: "Submit Order"
        });
        this.routing.push("/orders/" + data.order._id);
        this.checkoutStore.clearCart(this.userStore.getHeaderAuth());
        this.userStore.setDeliveryTime(null);
        this.setState({ placeOrderRequest: false });
      })
      .catch(e => {
        console.error("Failed to submit order", e);
        const msg = e.response.data.error.message;
        this.setState({ invalidText: msg, placeOrderRequest: false });
      });
  }

  handleReturnSet = (has_returns, pickup_notes) => {
    this.setState({
      hasReturns: has_returns,
      pickupNotes: pickup_notes
    });
  };

  handleCheckPromo = promoCode => {
    const subTotal = this.checkoutStore.order.subtotal;

    if (!promoCode) {
      this.setState({ invalidText: "Promo code empty" });
      return;
    }
    logEvent({ category: "Checkout", action: "AddPromo", label: promoCode });
    this.checkoutStore
      .checkPromo(
        {
          subTotal,
          promoCode
        },
        this.userStore.getHeaderAuth()
      )
      .then(data => {
        if (data.valid) {
          this.setState({
            appliedPromo: true,
            appliedPromoCode: promoCode,
            successText: "Promo applied successfully"
          });
          this.userStore.getUser().then(() => {
            this.loadData();
          });
        } else {
          this.setState({ invalidText: "Invalid promo code" });
        }
      })
      .catch(e => {
        if (!e.response.data.error) {
          this.setState({ invalidText: "Check promo failed" });
          return;
        }
        console.error("Failed to check promo", e);
        const msg = e.response.data.error.message;
        this.setState({ invalidText: msg });
      });
  };

  handleAddTip = () => {
    if (!this.state.tipApplyEdited) {
      this.setState({
        tipApplyEdited: true,
        freezedTipAmount: null
      });
      this.updateData();
    }
  };

  handleChangeTip = e => {
    this.setState({
      tipApplyEdited: false,
      appliedTipAmount: e.target.value,
      invalidText: ""
    });
  };

  handleAddPayment = data => {
    if (data) {
      logEvent({ category: "Checkout", action: "SubmitNewPayment" });
      this.userStore.setUserData(data);
      this.setState({
        selectedPayment: this.userStore.user.preferred_payment,
        newPayment: false
      });
    }
  };

  handleConfirmHome = () => {
    logEvent({ category: "Checkout", action: "ConfirmAtHome" });
    this.setState({
      confirmHome: !this.state.confirmHome,
      confirmHomeError: !!this.state.confirmHome
    });
  };

  handleTipAmountChange = (value, clickedByUser) => {
    const order = this.checkoutStore.order;
    const tipAmount = (value / 100) * order.subtotal;
    this.setState({
      appliedTipAmount: (tipAmount / 100).toFixed(2),
      tipReadOnly: true,
      appliedTipAmountChanged: clickedByUser,
      freezedTipAmount: null
    });
  };

  handleTipCustomAmounClick = () => {
    this.setState({
      tipReadOnly: false,
      freezedTipAmount: this.state.appliedTipAmount
    });
  };

  updateTotal() {
    const order = this.checkoutStore.order;
    const customTip =
      this.state.freezedTipAmount || this.state.appliedTipAmount;
    let total = order.total / 100;

    if (!order.tip_amount || this.state.appliedTipAmountChanged) {
      const currentTipAmount = order.tip_amount || 0;
      total = (order.total - currentTipAmount) / 100 + parseFloat(customTip);
    }
    return total;
  }

  updateTipAmount() {
    const order = this.checkoutStore.order;
    const customTip =
      this.state.freezedTipAmount || this.state.appliedTipAmount;
    const tipAmount =
      order.tip_amount && !this.state.appliedTipAmountChanged
        ? formatMoney(order.tip_amount / 100)
        : formatMoney(customTip);

    return tipAmount;
  }

  handleDeliveryNotesSubmit = notes => {
    this.setState({ order_notes: notes });
  };

  handleAllergyNotesSubmit = notes => {
    this.setState({ allergy_notes: notes });
  };

  render() {
    if (!this.checkoutStore.order || !this.userStore.user) {
      return null;
    }

    const order = this.checkoutStore.order;

    const applicableStoreCreditAmount = this.state.applicableStoreCreditAmount
      ? this.state.applicableStoreCreditAmount / 100
      : 0;

    let buttonPlaceOrderClass = "btn btn-main";
    const is_ecomm = this.userStore.is_ecomm;
    if (
      this.userStore.selectedDeliveryAddress &&
      this.state.lockPayment &&
      this.userStore.selectedDeliveryTime &&
      !this.state.placeOrderRequest &&
      !is_ecomm
    ) {
      buttonPlaceOrderClass += " active";
    }
    if (this.userStore.selectedDeliveryAddress && is_ecomm) {
      buttonPlaceOrderClass += " active";
    }

    const cart_items = order && order.cart_items ? order.cart_items : [];

    const orderTotal = this.updateTotal();

    return (
      <div className="App">
        <Title content="Checkout" />
        <div className="container">
          <div className="checkout-wrap">
            <div className="">
              <div style={{ maxWidth: "440px" }}>
                {this.userStore.user && (
                  <DeliveryAddressOptions
                    lock={this.state.lockAddress}
                    editable={true}
                    selected={
                      this.userStore.selectedDeliveryAddress
                        ? this.userStore.selectedDeliveryAddress.address_id
                        : null
                    }
                    user={this.userStore.user}
                    onAddNew={this.handleAddNewAddress}
                    onSubmit={this.handleSubmitAddress}
                    onSelect={this.handleSelectAddress}
                    onUnlock={this.handleUnlockAddress}
                  />
                )}
                {/* Also Here */}
                {this.userStore.user && (
                  <DeliveryTimeOptions
                    lock={false}
                    data={this.state.deliveryTimes}
                    selected={this.userStore.selectedDeliveryTime}
                    onSelectTime={this.handleSelectTime}
                    title={true}
                    user={this.userStore}
                  />
                )}

                {!is_ecomm && (
                  <React.Fragment>
                    <h3 className="m-0 mb-3 p-r mt-5">
                      Payment
                      {this.state.lockPayment ? (
                        <a
                          onClick={e => this.setState({ lockPayment: false })}
                          className="address-rbtn link-blue pointer"
                        >
                          CHANGE
                        </a>
                      ) : null}
                    </h3>
                    <PaymentSelect
                      {...{
                        lockPayment: this.state.lockPayment,
                        userPayment: this.userStore.user.payment,
                        userPreferredPayment: this.userStore.user
                          .preferred_payment,
                        onAddPayment: this.handleAddPayment,
                        onSubmitPayment: this.handleSubmitPayment,
                        userGuest: !this.userStore.status,
                        preselect: true
                      }}
                    />
                  </React.Fragment>
                )}
                {is_ecomm && <hr className="mt-4" />}

                <Notes
                  title="Order Notes"
                  placeholder="Any comments regarding your order, e.g., prefer ripe avocados? Leave them here!"
                  onSubmit={this.handleDeliveryNotesSubmit}
                />
                <Notes
                  default={this.userStore.user.allergy_notes || null}
                  title="Any Allergens?"
                  placeholder="Any allergies you want us to know about?"
                  onSubmit={this.handleAllergyNotesSubmit}
                />
                <Returns
                  title="Returns"
                  default={this.userStore.pickup_notes || null}
                  onReturnChange={this.handleReturnSet}
                />
              </div>
            </div>
            <div className="">
              <section
                className="order-summary mb-5"
                style={{ maxWidth: "440px" }}
              >
                <div className="card1 card-shadow">
                  <div className="card-body">
                    <h3 className="m-0 mb-2">Order Summary</h3>
                    <hr />
                    {cart_items.map((c, i) => {
                      const unit_type = c.unit_type || c.price_unit;
                      const showType =
                        unit_type === "packaging"
                          ? c.packaging_name
                          : unit_type;

                      return (
                        <div className="item mt-3 pb-2" key={i}>
                          <div className="item-left">
                            <h4 className="item-name">{c.product_name}</h4>
                            {unit_type !== "packaging" && (
                              <span className="item-detail mt-2 mb-1">
                                {c.packaging_name}
                              </span>
                            )}
                            <div className="item-link">
                              <a
                                onClick={e =>
                                  this.handleEdit(
                                    c.product_id,
                                    c.customer_quantity
                                  )
                                }
                                className="text-blue mr-2"
                              >
                                EDIT
                              </a>
                              <a
                                onClick={e => this.handleDelete(c)}
                                className="text-dark-grey"
                              >
                                DELETE
                              </a>
                            </div>
                          </div>
                          <div className="item-right">
                            <h4>
                              x{c.customer_quantity} {showType}
                            </h4>
                            <span className="item-price">
                              {formatMoney(c.total / 100)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="item-summaries">
                      <div className="summary">
                        <span>Subtotal</span>
                        <span>{formatMoney(order.subtotal / 100)}</span>
                      </div>
                      {order.tax_amount === 0 ? null : (
                        <div className="summary">
                          <span>Taxes</span>
                          <span>{formatMoney(order.tax_amount / 100)}</span>
                        </div>
                      )}
                      {order.service_amount === 0 ? null : (
                        <ServiceSummary
                          value={formatMoney(order.service_amount / 100)}
                        />
                      )}
                      {/* This is Milestone 1.a section */}
                      {order.delivery_amount === 0 ? null : (
                        <div className="summary">
                          <span>Delivery fee</span>
                          <span>
                            {!isNaN(order.delivery_amount) &&
                            order.delivery === null
                              ? "TBD"
                              : formatMoney(order.delivery_amount / 100)}
                          </span>
                        </div>
                      )}

                      {order.promo_discount === 0 ? null : (
                        <div className="summary">
                          <span>Applied discount</span>
                          <span>
                            -{formatMoney(order.promo_discount / 100)}
                          </span>
                        </div>
                      )}
                      {order.applied_store_credit === 0 ? null : (
                        <div className="summary">
                          <span>Applied store credit</span>
                          <span>
                            -{formatMoney(order.applied_store_credit / 100)}
                          </span>
                        </div>
                      )}

                      <TippingSummary value={this.updateTipAmount()} />
                      <PackagingSummary value={"TBD"} />

                      {this.state.appliedStoreCredit ? (
                        <div className="summary">
                          <span>Store credit applied</span>
                          <span>
                            {formatMoney(
                              this.state.appliedStoreCreditAmount / 100
                            )}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="item-extras">
                      {!this.state.appliedStoreCredit && 1 == 2 ? (
                        <div className="form-group">
                          <span className="text-blue">
                            Apply your store credit?
                          </span>
                          <div className="aw-input--group aw-input--group-sm">
                            <Input
                              className="aw-input--control aw-input--left aw-input--bordered"
                              type="text"
                              placeholder="Enter your store credit"
                              readOnly={true}
                              value={formatMoney(applicableStoreCreditAmount)}
                            />
                            <button
                              onClick={e => this.applyStoreCredit()}
                              type="button"
                              className="btn btn-transparent"
                            >
                              APPLY
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {!this.state.appliedPromo ? (
                        <PromoSummary onApply={this.handleCheckPromo} />
                      ) : null}
                      {!is_ecomm && (
                        <div className="form-group">
                          <span className="text-blue">Want to tip</span>
                          <AmountGroup
                            className="checkout-tips"
                            amountClick={this.handleTipAmountChange}
                            customClick={this.handleTipCustomAmounClick}
                            values={[0, 15, 20, 25]}
                            selected={15}
                            suffix="%"
                            custom={true}
                            product={false}
                          />
                          <div className="aw-input--group aw-input--group-sm">
                            <CurrencyInput
                              readOnly={this.state.tipReadOnly}
                              prefix="$"
                              className={`aw-input--control aw-input--left aw-input--bordered form-control ${
                                !this.state.tipReadOnly ? "focus-input" : ""
                              }`}
                              value={this.state.appliedTipAmount}
                              onChangeEvent={this.handleChangeTip}
                            />
                            {!this.state.tipReadOnly ? (
                              <button
                                onClick={this.handleAddTip}
                                type="button"
                                className={`btn btn-transparent purple-apply-btn ${
                                  this.state.tipApplyEdited ? "grey-btn" : ""
                                }`}
                              >
                                APPLY
                              </button>
                            ) : null}
                          </div>{" "}
                          <hr className="mt-4" />
                        </div>
                      )}
                    </div>

                    <div className="item-total">
                      <span>Total</span>
                      <span>{formatMoney(orderTotal)}</span>
                    </div>
                    {!is_ecomm && (
                      <div className="custom-control custom-checkbox mt-2 mb-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="homeCheck"
                          checked={this.state.confirmHome}
                          onChange={this.handleConfirmHome}
                        />
                        <label
                          className={`custom-control-label ${
                            this.state.confirmHomeError ? "text-error" : ""
                          }`}
                          onClick={this.handleConfirmHome}
                        >
                          I confirm that I will be at home or have a doorman
                        </label>
                      </div>
                    )}

                    <button
                      onClick={e => this.handlePlaceOrder()}
                      className={buttonPlaceOrderClass}
                    >
                      PLACE ORDER
                    </button>
                    {this.state.invalidText ? (
                      <span className="text-error text-center d-block mt-2">
                        {this.state.invalidText}
                      </span>
                    ) : null}
                    {this.state.successText ? (
                      <span className="text-success text-center d-block mt-2">
                        {this.state.successText}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3">
                  Prices and totals are subject to final adjustments based on
                  available products, weights and at-location prices. The
                  packaging deposit will be returned to your account as store
                  credit upon the return of used packaging during any future
                  order. By placing your order, you agree to be bound by the
                  Terms of Service and Privacy Policy. Your card will be
                  temporarily authorized for an amount slightly greater than the
                  estimated order total. Your statement will reflect the final
                  order total after order completion.{" "}
                  <Link to={"/help/topics/5b919926d94b070836bd5e4b"}>
                    Learn more.
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </div>
        <DeliveryChangeModal onChangeSubmit={this.handleChangeDelivery} />
      </div>
    );
  }
}

export default connect("store")(Checkout);
