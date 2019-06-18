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
      order_id: props.order_id,
      cart_item: props.cart_item,
      weight: "",
      isEdit: false
    }
    this.setWeight = this.setWeight.bind(this);
  }

  onClickButton = () => {
    if (this.state.isEdit) {
      this.props.saveCartRow(this.state.cart_item)
      this.handleItemUpdate()
      this.setState({
        isEdit: false,
        weight: this.state.weight
      })
    } else {
      this.setState({isEdit: true})
    }
  }

  handleItemUpdate = () => {
    const cartItemId = this.state.cart_item._id;
    const cartItem = this.state.cart_item;
    const orderId = this.state.order_id;
    let weight = this.state.weight;
    let TEST_API_SERVER = "http://localhost:4001/api/order"
    fetch(`${TEST_API_SERVER}/${orderId}/${cartItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_name: cartItem.product_name,
        substitute_for_name: cartItem.substitute_for_name,
        product_producer: cartItem.product_producer,
        product_price: (cartItem.product_price/ 100),
        final_quantity: cartItem.final_quantity,
        missing: cartItem.missing,
        weight: weight
      })
    })
    .then(response => console.log(response))
    .catch(error => console.log(error))
  }

  onInputChange = (e) => {
     const {cart_item, weight} = this.state
     cart_item[e.target.name] = e.target.value
     this.setState({cart_item, weight})
   }

   setWeight = (e) => {
     this.setState({
       weight: e.target.value,
     })
   }

  onSelect = (e) => {
    const {cart_item} = this.state
    cart_item[e.target.name] = e.target.value === "true"
    this.setState({cart_item})
  }

  render() {
    const {isEdit, cart_item, order_id, weight} = this.state
    let unit_type = cart_item.unit_type
    if (!unit_type) unit_type = cart_item.price_unit
    let initialTotal = (cart_item.initial_product_price/100 * cart_item.final_quantity).toFixed(2)
    let finalTotal = (cart_item.product_price/100 * cart_item.final_quantity).toFixed(2)
    let valuePriceChange = cart_item.initial_product_price - cart_item.product_price
    let pricePercentageChange = Math.abs(valuePriceChange / cart_item.product_price) * 100
    let valueQuantityChange = cart_item.final_quantity - cart_item.customer_quantity
    let quantityPercentageChange = Math.abs(valueQuantityChange / cart_item.customer_quantity) * 100
    const customColumnStyle = { width: 90, padding: 0 }
    const customColumnNameStyle = { width: 300 };
    return (
      <TableRow className={ pricePercentageChange >= 5 || quantityPercentageChange >= 5 ?
        "price-item-change" : cart_item.product_price !== cart_item.initial_product_price ||
          cart_item.final_quantity !== cart_item.customer_quantity  ?
         "cart-item-change" : "cart-item" }>
         <TableCell>
           <Input type="select"
                  name="missing"
                  value={cart_item.missing}
                  disabled={!isEdit}
                  onChange={this.onSelect}
                 style={customColumnStyle}
                  >
           <option value={true}>True</option>
           <option value={false}>False</option>
         </Input>
         </TableCell>
        <TableCell>
          <InputGroup>
            <Input placeholder="Name" value={cart_item.product_name}
            type="text"
            name="product_name"
            onChange={this.onInputChange}
            disabled={!isEdit}
            style={customColumnNameStyle}
            />
          </InputGroup>
        </TableCell>
        <TableCell>{cart_item.substitute_for_name}</TableCell>
        <TableCell>{cart_item.substitute_preference}</TableCell>
        <TableCell>{cart_item.product_producer}</TableCell>
        <TableCell>{cart_item.product_shop}</TableCell>
        <TableCell>${cart_item.initial_product_price / 100} / {cart_item.price_unit}</TableCell>
        <TableCell>
        <InputGroup>
          <InputGroupText>$</InputGroupText>
          <Input placeholder="Final Price" value={ cart_item.product_price }
                  type="number"
                  name="product_price"
                  onChange={this.onInputChange}
                  disabled={!isEdit}
                  style={customColumnStyle}
                  />
          {<InputGroupAddon addonType="append">
            <InputGroupText>{cart_item.unit_type === "packaging" ? cart_item.packaging_name : unit_type }</InputGroupText>
          </InputGroupAddon>}
        </InputGroup>
        </TableCell>
        <TableCell>{cart_item.customer_quantity}</TableCell>
        <TableCell>
            <InputGroup>
                <Input placeholder="Final Quantity" value={cart_item.missing ? 0 : cart_item.final_quantity}
                       type="number"
                       name="final_quantity"
                       onChange={this.onInputChange}
                       disabled={!isEdit}
                      style={customColumnStyle}
                       />
                {<InputGroupAddon addonType="append">
                  <InputGroupText>{cart_item.unit_type === "packaging" ? cart_item.packaging_name : unit_type }</InputGroupText>
                </InputGroupAddon>}
            </InputGroup>
        </TableCell>
        <TableCell>
        <InputGroup>
        { cart_item.price_unit == "lb" || cart_item.price_unit == "oz" ?
        <Input placeholder="Enter weight..." value={ weight }
               type="number"
               name="weight"
               onChange={this.setWeight}
               disabled={!isEdit}
               style={customColumnStyle}/> :
               <Input readOnly /> }
        </InputGroup>
        </TableCell>
        <TableCell>{initialTotal}</TableCell>
        <TableCell>{finalTotal}</TableCell>
        <TableCell><Button variant={"contained"} onClick={this.onClickButton}>{isEdit ? 'Submit' : 'Edit'}</Button></TableCell>
      </TableRow>
    );
  }
}

export default connect("store")(CartItem);
