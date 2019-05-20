import React, {Component} from 'react';
import {connect} from '../../../utils'
import {Container, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row} from "reactstrap"
import {
  Col, ControlLabel,
  FormControl, FormGroup,
} from "react-bootstrap";
import Button from '@material-ui/core/Button/Button'
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

class CartItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cart_item: props.cart_item,
      isEdit: false
    }
  }

  onClickButton = () => {
    if (this.state.isEdit) {
      this.props.saveCartRow(this.state.cart_item)
      this.setState({isEdit: false})
    } else {
      this.setState({isEdit: true})
    }
  }

  onInputChange = (e) => {
    const {cart_item} = this.state
    cart_item[e.target.name] = e.target.value
    this.setState({cart_item})
  }

  onSelect = (e) => {
    const {cart_item} = this.state
    cart_item[e.target.name] = e.target.value === "true"
    this.setState({cart_item})
  }

  // onColorChange = (value) => {
  //   const {cart_item} = this.state
  // }

  render() {
    const {isEdit, cart_item} = this.state
    console.log(cart_item.product_name)
    let unit_type = cart_item.unit_type
    if (!unit_type) unit_type = cart_item.price_unit
    let initialTotal = (cart_item.initial_product_price/100 * cart_item.final_quantity).toFixed(2)
    let finalTotal = (cart_item.product_price/100 * cart_item.final_quantity).toFixed(2)
    let valuePriceChange = cart_item.initial_product_price -cart_item.product_price
    let pricePercentageChange = Math.abs(valuePriceChange / cart_item.product_price) * 100
    let valueQuantityChange = cart_item.final_quantity -cart_item.customer_quantity
    let quantityPercentageChange = Math.abs(valueQuantityChange / cart_item.customer_quantity) * 100
    console.log((valuePriceChange / cart_item.product_price) * 100 >= 5)

    return (
      <TableRow className={ pricePercentageChange >= 5 || quantityPercentageChange >= 5 ?
        "price-item-change" : "cart-item" || cart_item.product_price !== cart_item.initial_product_price ||
          cart_item.customer_quantity !== cart_item.final_quantity  ?
         "cart-item-change" : "cart-item" } >
        <TableCell className="product-name">
          <InputGroup>
            <Input placeholder="Name" value={cart_item.product_name}
            type={"text"}
            name={"product_name"}
            onChange={this.onInputChange}
            disabled={!isEdit}
            />
          </InputGroup>
        </TableCell>
        <TableCell>{cart_item.substitute_for_name}</TableCell>
        <TableCell>${cart_item.initial_product_price / 100} / {cart_item.price_unit}</TableCell>
        <TableCell>
        <InputGroup>
          $<Input placeholder="Final Price" value={cart_item.product_price /100}
          type={"number"}
          name={"final_price"}
          onChange={this.onInputChange}
          disabled={!isEdit}/>
          {<InputGroupAddon addonType="append">
            <InputGroupText>{cart_item.price_unit === "packaging" ? cart_item.packaging_name : unit_type }</InputGroupText>
          </InputGroupAddon>}
        </InputGroup>
        </TableCell>
        <TableCell>{cart_item.customer_quantity}</TableCell>
        <TableCell>
            <InputGroup>
                <Input placeholder="Final Quantity" value={cart_item.missing ? 0 : cart_item.final_quantity}
                       type={"number"}
                       name={"final_quantity"}
                       onChange={this.onInputChange}
                       disabled={!isEdit}/>
                {<InputGroupAddon addonType="append">
                  <InputGroupText>{cart_item.unit_type === "packaging" ? cart_item.packaging_name : unit_type }</InputGroupText>
                </InputGroupAddon>}
            </InputGroup>
        </TableCell>
        <TableCell>
          <Input type="select"
                 name="missing"
                 value={cart_item.missing}
                 disabled={!isEdit}
                 onChange={this.onSelect}>
          <option value={true}>True</option>
          <option value={false}>False</option>
        </Input>
        </TableCell>
        <TableCell><Button variant={"contained"} onClick={this.onClickButton}>{isEdit ? 'Submit' : 'Edit'}</Button></TableCell>
        <TableCell>{initialTotal}</TableCell>
        <TableCell>{finalTotal}</TableCell>
      </TableRow>
    );
  }
}

export default connect("store")(CartItem);
