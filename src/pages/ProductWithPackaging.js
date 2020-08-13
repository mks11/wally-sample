import React, { Component } from "react";
import { Row, Col } from "reactstrap";

import { logPageView, logEvent } from "services/google-analytics";
import { formatMoney, connect } from "utils";
import { PRODUCT_BASE_URL } from "config";
import AmountGroup from "common/AmountGroup";

import QuantitySelect from "../common/QuantitySelect";
import Addons from "../common/ProductAddons";

class ProductWithPackaging extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qty: 1,
      infoPackage: false,
      slick: false,
      subtitutes: [],
      selectedSubtitute: 0,
      packagingAddon: "",
      quantityAddon: 0,
      outOfStock: false,
      available: true,
      availableDays: [],
      packagingType: null,
      priceMultiplier: 1,
      product: null,
    };
  }

  async componentDidMount() {
    const subtitutes = [
      {
        id: 0,
        text: "Substitute with Wally Shop recommendation",
      },
      {
        id: 1,
        text: "Remove item",
      },
    ];

    const {
      product: productStore,
      user: userStore,
      packagingUnit: packagingStore,
      modal: modalStore,
    } = this.props.store;
    const packagingUnitId = this.props.packagingId;
    const packagingUnit = await packagingStore.getPackagingUnit(
      packagingUnitId
    );
    const deliveryParams = userStore.getDeliveryParams();
    const product = await productStore.getProductDetails(
      packagingUnit.product_id,
      deliveryParams
    );

    this.setState({
      product,
    });

    this.state.qty = product.min_size;
    const priceMultiplier = product.buy_by_packaging
      ? product.packaging_vol[0]
      : 1;
    this.setState({ priceMultiplier: priceMultiplier });

    const packagingType = product.buy_by_packaging
      ? product.packagings[0].type
      : null;
    this.setState({ packagingType: packagingType });

    if (product.organic) {
      subtitutes.unshift({
        id: 2,
        text: "Substitute for organic only",
      });
    }

    const daysOfWeek = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };
    let availableDays = product.available_days.sort();
    availableDays = availableDays.map((d) => daysOfWeek[d]);

    this.setState({
      subtitutes,
      outOfStock: product.fbw && product.out_of_stock,
      available: product.available_for_delivery,
      availableDays: availableDays,
    });

    logPageView("/packaging/" + packagingUnit.product_id);

    if (product.add_ons && product.add_ons.length) {
      const { addonsFirst } = userStore.flags || {};
      !addonsFirst && modalStore.toggleAddonsFirst();
    }
  }

  componentDidUpdate() {
    const { product } = this.props.store;

    if (!this.state.slick) {
      this.setState({ slick: true, qty: product.customer_quantity });
      const $thumb = window.$(this.thumb);
      const $prod = window.$(this.prod);
      $prod.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: "#thumbnailproduct-carousel",
        dots: false,
        infinite: false,
        arrows: false,
      });
      $thumb.slick({
        slidesToShow: 3,
        slidesToScroll: 3,
        asNavFor: "#product-carousel",
        dots: false,
        infinite: false,

        variableWidth: true,
      });
      $thumb.find(".slick-item").click(function () {
        $prod.slick("slickGoTo", window.$(this).index());
      });
    }
  }

  toggleInfoPackage = () => {
    this.setState({ infoPackage: !this.state.infoPackage });
  };

  toggleSubstituteRecommendation = () => {
    this.setState({
      substituteRecommendation: !this.state.substituteRecommendation,
    });
  };

  handleSelectSubtitute(id) {
    logEvent({ category: "Product", action: "ChooseSubstitute" });
    this.setState({ selectedSubtitute: id });
  }

  // handleCloseModal(e) {
  //   logEvent({category:"Product", action:"ClickClosed", label:this.productStore.activeProductId})
  //   this.props.toggle()
  // }

  handleAddToCart = () => {
    const { product: productStore, checkout, user, routing } = this.props.store;

    const {
      custom,
      customIsEmpty,
      quantityAddon,
      packagingAddon,
      outOfStock,
      available,
      packagingType,
    } = this.state;

    if (outOfStock || !available) return;

    if (custom && customIsEmpty) {
      this.setState({
        customError: true,
      });
      return;
    }

    logEvent({
      category: "Product",
      action: "AddToCart",
      value: this.state.qty,
      label: productStore.activeProductId,
    });
    const product = this.state.product;
    const inventory = product.available_inventory[0]
      ? product.available_inventory[0]
      : null;
    const order_summary = routing.location.pathname.indexOf("checkout") !== -1;
    const unit_type = product.unit_type || product.price_unit;

    const finalUnitType =
      product.buy_by_packaging && packagingType ? "packaging" : unit_type;
    const packaging = product.packagings[0] ? product.packagings[0] : null;
    const defaultPackagingId = packaging ? packaging.id : null;
    const customPackaging = packagingType
      ? product.packagings.find((p) => p.type === packagingType)._id
      : null;
    const packagingId = customPackaging || defaultPackagingId;

    const items = [
      {
        quantity: this.state.qty,
        product_id: inventory.product_id,
        inventory_id: inventory._id,
        sub_pref: this.state.selectedSubtitute,
        unit_type: finalUnitType,
        packaging_id: packagingId,
      },
    ];

    if (quantityAddon > 0) {
      const addonProduct = product.add_ons.find(
        (p) => p.product_id === packagingAddon
      );

      items.push({
        quantity: quantityAddon,
        product_id: packagingAddon,
        inventory_id: addonProduct.inventory[0]._id,
        unit_type: addonProduct.unit_type,
      });
    }

    checkout
      .editCurrentCart(
        { items },
        user.getHeaderAuth(),
        order_summary,
        user.getDeliveryParams()
      )
      .then((data) => {
        data &&
          user.adjustDeliveryTimes(
            data.delivery_date,
            this.state.deliveryTimes
          );
      })
      .catch((e) => {
        if (e.response) {
          const msg = e.response.data.error.message;
          this.setState({ invalidText: msg });
          console.error("Failed to add to cart", e);
        }
      });

    // this.props.toggle()
  };

  handleSelectQuantity = (e) => {
    this.setState({ qty: e.target.value });
  };

  handlePackagingAddon = (value) => {
    this.setState({ packagingAddon: value });
  };

  handleQuantityAddon = (value) => {
    this.setState({ quantityAddon: value });
  };

  handlePackagingChange = (value) => {
    this.setState({ packagingType: value.type });
    const product = this.state.product;
    let idx = product.packaging_id
      .map(function (i) {
        return i.toString();
      })
      .indexOf(value._id);
    let vol = product.packaging_vol[idx];
    this.setState({ priceMultiplier: vol });
  };

  handlePackagingCustomClick = () => {
    this.setState({ packagingType: null });
  };

  render() {
    const { packagingType, product } = this.state;

    if (!product) return null;

    let shipMessage = `Fulfilled by The Wally Shop.`;
    if (product.available_inventory[0])
      shipMessage = `Sold by ${product.available_inventory[0].shop}, fulfilled by The Wally Shop`;
    if (product.fbw)
      shipMessage =
        "Sold by " + product.vendor + ", fulfilled by The Wally Shop.";

    let infoPackageClass = "package-info";
    if (this.state.infoPackage) {
      infoPackageClass += " open";
    }

    const inventory = product.available_inventory[0]
      ? product.available_inventory[0]
      : null;
    const limitOptions =
      product.fbw && !product.out_of_stock && product.available;
    let qtyOptions = [];

    const incrementValue =
      product.buy_by_packaging && packagingType ? 1 : product.increment_size;
    const minSize =
      product.buy_by_packaging && packagingType ? 1 : product.min_size;
    const maxQty = limitOptions ? Math.min(product.max_qty, 10) : 10;
    for (var i = 0; i < maxQty; i++) {
      var opt = minSize + i * incrementValue;
      qtyOptions.push(+opt.toFixed(3));
    }

    let price = inventory.price / 100;

    let totalPrice = price * this.state.qty * this.state.priceMultiplier;

    const unit_type = product.unit_type;
    var price_unit = "";
    if (["ea"].includes(unit_type)) {
      if (product.subcat_name) {
        price_unit = product.subcat_name;
      } else {
        price_unit = "unit";
      }
    } else {
      price_unit += unit_type;
    }

    var weight_unit = "lbs";
    var unit_weight = product.unit_weight;
    if (unit_weight && product.unit_weight && unit_weight < 0.05) {
      weight_unit = "oz";
      unit_weight = unit_weight * 16;
    }

    if (unit_weight) {
      unit_weight.toFixed(1);
    }

    const packaging =
      product.packagings && product.packagings[0]
        ? product.packagings[0]
        : null;
    const packaging_type = product.std_packaging;
    const packaging_description = packaging ? packaging.description : null;

    return (
      <div className={"container"}>
        <Row>
          <Col sm="6">
            <div className="row mb-3">
              <div className="col-sm-6">
                <h3 className="mb-0">{product.name}</h3>
              </div>
              <div className="col-sm-6">
                <div
                  id="thumbnailproduct-carousel"
                  ref={(el) => (this.thumb = el)}
                >
                  {product.image_refs.map((item, key) => (
                    <div key={key} className="slick-item">
                      <img src={PRODUCT_BASE_URL + item} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div id="product-carousel" ref={(el) => (this.prod = el)}>
              {product.image_refs.map((item, key) => (
                <div key={key} className="slick-item">
                  <img src={PRODUCT_BASE_URL + item} alt="" />
                </div>
              ))}
            </div>
          </Col>
          <Col sm="6">
            <div className="modal-product-price">
              Price: <span>{formatMoney(price)}</span> / {price_unit}
            </div>
            <div>{shipMessage}</div>
            <div>Sold by the {price_unit}.</div>
            {["ea", "bunch", "pint"].includes(unit_type) &&
              product.unit_weight && (
                <div>
                  Average weight is {product.unit_weight} {weight_unit}.
                </div>
              )}
            <hr />

            <div className={infoPackageClass}>
              <strong>Packaged in:</strong>{" "}
              <i
                onClick={this.toggleInfoPackage}
                className="fa fa-info-circle"
              ></i>
              <div className="package-info-popover">
                <h4>{packaging_type}</h4>
                <p>{packaging_description}</p>
                <p>
                  <a href="#">Click here</a> to learn more or see full
                  breakdown.
                </p>
              </div>
            </div>
            <div className="mb-3">
              {!product.buy_by_packaging
                ? packaging_type
                : product.std_packaging}
            </div>
            {product.buy_by_packaging && (
              <React.Fragment>
                <div>
                  <strong>Size:</strong>
                </div>
                <AmountGroup
                  groupped={false}
                  className="package-type-group"
                  amountClick={this.handlePackagingChange}
                  customClick={this.handlePackagingCustomClick}
                  values={product.packagings ? product.packagings : []}
                  selected={
                    product.packagings ? product.packagings[0].type : null
                  }
                  weights={product.packagings ? product.packaging_vol : []}
                  unit_type={product.unit_type}
                  custom={false}
                  product={true}
                />
              </React.Fragment>
            )}

            <div>
              <strong>Choose your quantity</strong>
            </div>
            <QuantitySelect
              value={this.state.qty}
              onSelectChange={this.handleSelectQuantity}
              options={qtyOptions}
              price_unit={product.buy_by_packaging ? "" : price_unit}
            />
            <hr />
            <div>
              <strong>If item is unavailable:</strong>
            </div>
            {this.state.subtitutes.map((sub, key) => (
              <div
                className={
                  "custom-control red custom-radio " +
                  (sub.id === this.state.selectedSubtitute ? " active" : "")
                }
                key={key}
              >
                <input
                  type="radio"
                  name="customRadio"
                  checked={this.state.selectedSubtitute === sub.id}
                  className="custom-control-input"
                  value={sub.id}
                  onChange={() => this.handleSelectSubtitute(sub.id)}
                />

                <label
                  className="custom-control-label small"
                  onClick={() => this.handleSelectSubtitute(sub.id)}
                >
                  {sub.text}&nbsp;
                </label>
                {key === 1 ? (
                  <React.Fragment>
                    <i
                      onClick={this.toggleSubstituteRecommendation}
                      className="fa fa-info-circle"
                    ></i>
                    <div
                      className={`${
                        this.state.substituteRecommendation ? "open" : ""
                      }`}
                    >
                      <div className="package-info-popover substitue-popover">
                        <p>
                          We'll do our best to get a near perfect substitute for
                          you, like spring onions for scallions. If we're unsure
                          about it, we'll contact you to make sure the
                          substitution works for you.
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            ))}
            <hr />
            {product.add_ons && product.add_ons.length ? (
              <Addons
                addons={product.add_ons}
                packagingAddon={this.state.packagingAddon}
                quantityAddon={this.state.quantityAddon}
                onPackagingAddon={this.handlePackagingAddon}
                onQuantityAddon={this.handleQuantityAddon}
              />
            ) : null}
            <div className="mb-2">Total: {formatMoney(totalPrice)}</div>
            <button
              onClick={this.handleAddToCart}
              className={`btn btn-danger btn-add-cart mb-2 ${
                this.state.outOfStock || !this.state.available ? "inactive" : ""
              }`}
            >
              {this.state.outOfStock
                ? "Out of Stock"
                : this.state.available
                ? "Add to cart"
                : "Unavailable"}
            </button>
            <br />
            <div
              className={`${
                this.state.available ? "text-muted" : "text-muted-alert"
              }`}
            >
              {this.state.available
                ? "Final total subject to measured weights and at-location prices"
                : `Available days for delivery: ${this.state.availableDays.join(
                    ", "
                  )}.`}
            </div>

            <div
              className={`${
                this.state.available ? "text-muted" : "text-muted-alert"
              }`}
            >
              {this.state.available
                ? ""
                : "Click on clock icon next to categories to change delivery date."}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <hr />
            <h3>Product Info</h3>
            <div className="media media-xs">
              <div className="media-body">
                <div className="row">
                  <div className="col-sm-6">
                    <div>
                      <span className="font-weight-bold">Local:</span>{" "}
                      {product.local ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <span className="font-weight-bold">Organic:</span>{" "}
                      {product.organic ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-weight-bold">Farms:</span>{" "}
                  {product.farms && product.farms.join(", ")}
                </div>
                {product.fbw && product.description && (
                  <div>
                    <span className="font-weight-bold">Description:</span>{" "}
                    {product.description}
                  </div>
                )}
                {product.fbw && product.instruction && (
                  <div>
                    <span className="font-weight-bold">Instructions:</span>{" "}
                    {product.instruction}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect("store")(ProductWithPackaging);
