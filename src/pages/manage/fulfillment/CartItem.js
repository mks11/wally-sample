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

  render() {
    const {isEdit, cart_item} = this.state
    return (
      <TableRow className="cart-item">
        <TableCell>{cart_item.product_name}</TableCell>
        <TableCell>{cart_item.substitute_for_name}</TableCell>
        <TableCell>$ {cart_item.product_price / 100}</TableCell>
        <TableCell>
            <InputGroup>
                <Input placeholder="Quantity" value={cart_item.missing ? 0 : cart_item.customer_quantity}
                       type={"number"}
                       name={"customer_quantity"}
                       onChange={this.onInputChange}
                       disabled={!isEdit}
/>
                {<InputGroupAddon addonType="append">
                    <InputGroupText>{cart_item.price_unit}</InputGroupText>
                </InputGroupAddon>}
            </InputGroup>
        </TableCell>
        <TableCell>
          <Input type="select"
                           name="missing"
                           value={cart_item.missing}
                           disabled={!isEdit}
                           onChange={this.onSelect}
        >
          <option value={true}>True</option>
          <option value={false}>False</option>
        </Input>
        </TableCell>
        <TableCell><Button variant={"contained"} onClick={this.onClickButton}>{isEdit ? 'Submit' : 'Edit'}</Button></TableCell>
      </TableRow>
    );
  }
}

export default connect("store")(CartItem);
