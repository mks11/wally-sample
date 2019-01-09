import React, {Component} from 'react';
import {connect} from '../../../utils'
import {Container, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label} from "reactstrap"
import {
  Col,
  Row,
  ControlLabel, FormControl
} from "react-bootstrap";
import Button from '@material-ui/core/Button/Button'
import CloseIcon from '@material-ui/icons/Close';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftOutlined';
import ArrowRight from '@material-ui/icons/KeyboardArrowRightOutlined';
import Typography from "@material-ui/core/Typography/Typography";
import Select from 'react-select'
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import CartItem from "./CartItem";

class SingleOrderView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOrder: props.selectedOrder,
      cart_items: props.selectedOrder.cart_items,
      packagings: props.packagings.map(packaging => {return {...packaging, quantity: 0}})
    }
  }

  saveCartRow = (cart_item, index) => {
    const {cart_items} = this.state
    cart_items.map((item, i) => {
      if (i === index) {
        return cart_item
      } else {
        return item
      }
    })
    /*    cart_items[index] = cart_item
        this.setState({cart_items})*/
  }

  render() {
    const {cart_items, selectedOrder, packagings} = this.state
    return (
      <section className="page-section pt-1 single-product">
        <Container>
          <div className="mb-3">
            <Button variant="contained" color="default" onClick={this.props.toggle}>
              <CloseIcon/>
              <Typography>Close</Typography>
            </Button>
          </div>
          <h2>Single Order View</h2>
          <hr/>
          <Paper elevation={1} className={"scrollable-table"}>
            <Table className={"packaging-table"} padding={"dense"}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Substitute For</TableCell>
                  <TableCell>Total Paid</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Missing</TableCell>
                  <TableCell>Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart_items.map((cart_item, i) =>
                  <CartItem key={cart_item._id} cart_item={cart_item} index={i} saveCartRow={this.saveCartRow}/>
                )}
              </TableBody>
            </Table>
          </Paper>
          <FormGroup className={"single-order-total"}>
            <Row>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Subtotal:</strong>
              </Col>
              <Col sm={4}>
                {selectedOrder.subtotal / 100} $
              </Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Original Subtotal:</strong>
              </Col>
              <Col sm={4}>
                TODO
              </Col>
            </Row>
          </FormGroup>
          <Table className={"packaging-table"}>
            <TableBody>
              {packagings.map((packaging, i) =>
                <TableRow>
                  <TableCell><strong>{packaging.type}</strong></TableCell>
                  <TableCell> <FormControl placeholder="Enter Quantity" value={packaging.quantity}/></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </Container>
      </section>
    );
  }
}

export default connect("store")(SingleOrderView);
