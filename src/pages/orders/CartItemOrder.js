import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row
} from "reactstrap";
import { Col, ControlLabel, FormControl, FormGroup } from "react-bootstrap";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Switch from "react-switch";
import MissingModal from "./MissingModal";
import OrderErrorModal from "./OrderErrorModal";

const textSwitch = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  fontSize: 15,
  color: "#fff",
  paddingRight: 2
};
const customColumnStyle = { width: 90, padding: 0 };
class CartItemOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_id: props.order_id,
      cart_item: props.cart_item,
      weight: "",
      quantityUnit:
        props.cart_item.price_unit === "packaging"
          ? props.cart_item.packaging_name
          : props.cart_item.price_unit,
      missing: props.cart_item.missing,
      error: props.cart_item.product_error_reason,
      isMissingModalOpen: false,
      isErrorModalOpen: false
    };
  }

  onClickButton = e => {
    this.props.saveCartRow(this.state.cart_item);
    this.handleItemUpdate();
    let code = e.keyCode || e.which;
    if (code === 13) {
      this.setState({
        weight: this.state.weight
      });
    }
  };

  handleItemUpdate = missing => {
    const cartItemId = this.state.cart_item._id;
    const cartItem = this.state.cart_item;
    const orderId = this.state.order_id;
    let weight = this.state.weight;
    let errorReason = cartItem.error_reason;
    let TEST_API_SERVER = "http://localhost:4001/api/order";
    fetch(`${TEST_API_SERVER}/${orderId}/${cartItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_name: cartItem.product_name,
        substitute_for_name: cartItem.substitute_for_name,
        product_producer: cartItem.product_producer,
        product_price: cartItem.product_price / 100,
        final_quantity: cartItem.final_quantity,
        missing: missing,
        weight: weight,
        error_reason: errorReason
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  onInputChange = e => {
    const { cart_item, weight } = this.state;
    cart_item[e.target.name] = e.target.value;
    this.setState({ cart_item, weight });
  };

  setWeight = e => {
    this.setState({
      weight: e.target.value
    });
  };

  toggleMissing = e => {
    if (e) {
      this.toggleMissingModal();
    }
  };

  toggleMissingModal = () => {
    this.setState({
      isMissingModalOpen: !this.state.isMissingModalOpen
    });
  };

  makePatchAPICall = async () => {
    const { missing } = this.state;
    await this.handleItemUpdate(!missing);
    this.setState({
      missing: !missing
    });
  };

  makePatchAPICallError = async childState => {
    const error = {
      error_reason: childState.ugly ? "ugly" : "tooLittle",
      final_quantity: childState.cart_item.final_quantity
    };

    this.setState(
      {
        cart_item: { ...this.state.cart_item, ...console.error() }
      },
      async () => {
        await this.handleItemUpdate();
        this.toggleErrorOff();
      }
    );
  };

  toggleErrorModal = e => {
    e.preventDefault();
    this.setState({
      isErrorModalOpen: true
    });
  };

  toggleErrorOff = e => {
    this.setState({
      isErrorModalOpen: false
    });
  };

  render() {
    const {
      isEdit,
      cart_item,
      order_id,
      weight,
      quantityUnit,
      missing,
      error
    } = this.state;

    let unit_type = cart_item.unit_type;
    if (!unit_type) unit_type = cart_item.price_unit;
    return (
      <TableRow className="cart-item">
        <TableCell>{cart_item.product_name}</TableCell>
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
            onClick={this.toggleMissingModal}
            checked={missing}
            checkedIcon={<div style={textSwitch}>Yes</div>}
            uncheckedIcon={<div style={textSwitch}>No</div>}
          />
          <MissingModal
            makePatchAPICall={this.makePatchAPICall}
            isOpen={this.state.isMissingModalOpen}
            onClose={this.toggleMissingModal}
          />
        </TableCell>
        <TableCell className="error-code">
          <p onClick={this.toggleErrorModal}>123</p>
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
            {cart_item.price_unit == "lb" ||
            cart_item.price_unit == "oz" ||
            cart_item.unit_type == "lb" ||
            cart_item.unit_type == "oz" ||
            cart_item.product_shop === "TWS" ? (
              <Input
                placeholder="Enter weight..."
                value={weight}
                type="number"
                name="weight"
                onChange={this.setWeight}
                onKeyPress={this.onClickButton}
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

export default connect("store")(CartItemOrder);
