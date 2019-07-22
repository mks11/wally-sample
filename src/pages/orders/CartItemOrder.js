import React, { Component } from "react";
import {
  Input,
  InputGroup,
} from "reactstrap";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Switch from "react-switch";
import MissingModal from "./MissingModal";
import OrderErrorModal from "./OrderErrorModal";
import { BASE_URL } from "../../config";

const textSwitch = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  fontSize: 12,
  color: "#fff",
  paddingRight: 2
};
const customColumnStyle = { width: 60, padding: 0 };
class CartItemOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart_item: props.cart_item,
      weight: "",
      quantityUnit:
        props.cart_item.unit_type === "packaging"
          ? props.cart_item.packaging_name
          : props.cart_item.price_unit,
      unconfirmedMissingState: null,
      isErrorModalOpen: false
    };
  }

  handleItemUpdate = () => {
    const cartItemId = this.props.cart_item._id;
    const cartItem = this.props.cart_item;
    const orderId = this.props.order_id;
    let weight = this.state.weight;
    let errorReason = cartItem.product_error_reason;
    return fetch(`${BASE_URL}/api/order/${orderId}/${cartItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_name: cartItem.product_name,
        substitute_for_name: cartItem.substitute_for_name,
        product_producer: cartItem.product_producer,
        final_quantity: Number(cartItem.final_quantity),
        missing: this.props.cart_item.missing,
        weight: weight,
        product_error_reason: errorReason
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  handleWeightKeyPress = async e => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      await this.props.onCartStateChange({
        _id: this.props.cart_item._id,
        weight: this.state.weight
      });
      this.handleItemUpdate();
    }
  };

  setWeight = e => {
    const { cart_item, weight } = this.state;
    cart_item[e.target.name] = e.target.value;
    this.setState({
      weight: e.target.value
    });
    this.handleItemUpdate();
  };

  toggleMissing = isMissing => {
    this.setState({
      unconfirmedMissingState: isMissing
    });
  };

  cancelMissing = () => {
    this.setState({
      unconfirmedMissingState: null
    });
  };

  handlePatchMissing = async () => {
    const { unconfirmedMissingState } = this.state;
    await this.props.onCartStateChange({
      _id: this.props.cart_item._id,
      missing: unconfirmedMissingState
    });

    await this.handleItemUpdate();
    this.setState({
      unconfirmedMissingState: null
    });
  };

  makePatchAPICallError = async childState => {
    const error = {
      product_error_reason: childState.noError
        ? "no_error"
        : childState.ugly
        ? "ugly"
        : "too_little",
      final_quantity: Number(childState.cart_item.final_quantity)
    };
    this.setState(
      {
        cart_item: {
          ...this.state.cart_item,
          product_error_reason: error.product_error_reason
        }
      },
      async () => {
        await this.handleItemUpdate();
      }
    );
    this.toggleErrorOff();
    await this.props.onCartStateChange({
      _id: this.props.cart_item._id,
      final_quantity: error.final_quantity,
      product_error_reason: error.product_error_reason
    });
  };

  toggleErrorModal = e => {
    e.preventDefault();
    this.setState({
      isErrorModalOpen: true
    });
  };

  toggleErrorOff = e => {
    console.log("toggleErrorOff", e);
    this.setState({
      isErrorModalOpen: false
    });
  };

  render() {
    const { weight, quantityUnit, error, unconfirmedMissingState } = this.state;
    const { cart_item, order_id } = this.props;
    const missing = cart_item.missing;
    let unit_type = cart_item.unit_type;
    if (!unit_type) unit_type = cart_item.price_unit;
    return (
      <TableRow className="cart-item">
        <TableCell>{cart_item.missing ? 0 : cart_item.final_quantity} {quantityUnit} - {cart_item.product_name}</TableCell>
        <TableCell>{cart_item.product_producer}</TableCell>
        <TableCell>{cart_item.product_shop}</TableCell>
        <TableCell>
          {cart_item.customer_quantity} {quantityUnit}
        </TableCell>
        <TableCell>
          {cart_item.missing ? 0 : cart_item.final_quantity} {quantityUnit}
        </TableCell>
        <TableCell>
          <Switch
            className="react-switch"
            value={missing}
            onChange={this.toggleMissing}
            checked={
              unconfirmedMissingState === null
                ? missing
                : unconfirmedMissingState
            }
            checkedIcon={<div style={textSwitch}>Yes</div>}
            uncheckedIcon={<div style={textSwitch}>No</div>}
          />
          <MissingModal
            onConfirm={this.handlePatchMissing}
            isOpen={this.state.unconfirmedMissingState !== null}
            onCancel={this.cancelMissing}
          />
        </TableCell>
        <TableCell className="error-code">
          <p onClick={this.toggleErrorModal}>
            {cart_item.product_error_reason &&
            !cart_item.product_error_reason == "no_error"
              ? cart_item.product_error_reason
              : "Ok"}
          </p>
          <OrderErrorModal
            cart_item={cart_item}
            quantityUnit={quantityUnit}
            isOpen={this.state.isErrorModalOpen}
            onClose={this.toggleErrorOff}
            makePatchAPICallError={this.makePatchAPICallError}
          />
        </TableCell>
        <TableCell>
          <InputGroup>
            {cart_item.unit_type === "lb" ||
            cart_item.unit_type === "oz" ||
            (cart_item.product_shop === "TWS" &&
              cart_item.price_unit === "lb") ||
            (cart_item.product_shop === "TWS" &&
              cart_item.price_unit === "oz") ? (
              <Input
                placeholder={cart_item.weight}
                value={weight}
                type="number"
                name="weight"
                onChange={this.setWeight}
                onKeyPress={this.handleWeightKeyPress}
                style={customColumnStyle}
              />
            ) : (
              <Input readOnly />
            )}
          </InputGroup>
        </TableCell>
      </TableRow>
    );
  }
}

export default CartItemOrder;
