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

class CourierModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courier: props.courier
    };
  }

  onNameChange = e => {
    const { courier } = this.state;
    // cart_item.name = e.target.value;
    // this.setState({ cart_item });
  };

  onEmailChange = e => {
    const { courier } = this.state;
    // cart_item.paypal_email = e.target.value;
    // this.setState({ cart_item });
  };

  render() {
    const { name } = this.state;

    if (!this.props.isOpen) {
      return null;
    }
    return (
      <div className="courier">
        <div className="backdrop">
          <Paper className="courier-modal" elevation={3}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="string"
                        placeholder="enter your name here"
                        onChange={this.onNamelChange}
                      />
                    </InputGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Telephone Number:</TableCell>
                  <TableCell>617-794-8249</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Paypal Email:</TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        type="string"
                        placeholder="enter paypal email"
                        onChange={this.onEmailChange}
                      />
                    </InputGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button>Create</Button>
          </Paper>
        </div>
      </div>
    );
  }
}

export default CourierModal;
