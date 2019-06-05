import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Col, Row, ControlLabel, FormControl, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

class OrderErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart_item: props.cart_item,
      quantityUnit: props.quantityUnit,
      tooLittle: true,
      ugly: false
    };
  }
  onLittleChange = e => {
    const { ugly, tooLittle } = this.state;
    this.setState({
      ugly: false,
      tooLittle: true
    });
  };

  onUglyChange = e => {
    const { ugly, tooLittle } = this.state;
    this.setState({
      ugly: true,
      tooLittle: false
    });
  };

  onQuantityChange = e => {
    const { cart_item } = this.state;
    cart_item.final_quantity = e.target.value;
    this.setState({ cart_item });
  };

  render() {
    const { cart_item, quantityUnit } = this.state;

    if (!this.props.isOpen) {
      return null;
    }
    console.log(this.props);
    return (
      <div className="error">
        <div className="backdrop">
          <Paper className="error-modal" elevation={3}>
            <button className="modal-button" onClick={this.props.onClose}>
              x
            </button>
            <h2 className="error-header">{cart_item.product_name} Error</h2>
            <p>Reason:</p>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <p>Too lttle:</p>
                  </TableCell>
                  <TableCell>
                    <Input
                      name="tooLittle"
                      type="checkbox"
                      checked={this.state.tooLittle}
                      onChange={this.onLittleChange}
                    />
                  </TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>Ugly:</p>
                  </TableCell>
                  <TableCell>
                    <Input
                      name="ugly"
                      type="checkbox"
                      checked={this.state.ugly}
                      onChange={this.onUglyChange}
                    />
                  </TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <p>Quantity Available:</p>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      max={parseInt(cart_item.customer_quantity)}
                      onChange={this.onQuantityChange}
                    />
                  </TableCell>
                  <TableCell>
                    {cart_item.customer_quantity} {quantityUnit}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              className="error-submit"
              variant="contained"
              color="primary"
              size={"large"}
              type={"button"}
              onClick={() => this.props.makePatchAPICallError(this.state)}
            >
              Submit
            </Button>
          </Paper>
        </div>
      </div>
    );
  }
}

export default OrderErrorModal;
