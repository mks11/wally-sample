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
import { BASE_URL } from "../../config";

class CourierModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      paypal_email: ""
    };

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
  }

  onNameChange = e => {
    const { name } = this.state;
    this.setState({
      name: e.target.value
    });
  };

  onEmailChange = e => {
    const { paypal_email } = this.state;
    this.setState({
      paypal_email: e.target.value
    });
  };

  createNewCourier = e => {
    const name = this.state.name;
    const paypal_email = this.state.paypal_email;
    fetch(`${BASE_URL}/api/admin/courier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        telephone_number: this.props.courierPhoneNumber,
        paypal: paypal_email
      })
    })
      .then(response => console.log(response))
      .then(response => this.setState({}))
      .catch(e => alert(e));
    this.props.onClose();
    e.stopPropagation();
  };

  render() {
    const { name, paypal_email } = this.state;
    const { courierPhoneNumber } = this.props;
    if (!this.props.isOpen) {
      return null;
    }

    const isEnabled = name.length > 0 && paypal_email.length > 0;
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
                        placeholder="Enter name..."
                        value={name}
                        name="name"
                        type="string"
                        placeholder="enter courier name here"
                        onChange={this.onNameChange}
                      />
                    </InputGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Telephone Number:</TableCell>
                  <TableCell>{courierPhoneNumber}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Paypal Email:</TableCell>
                  <TableCell>
                    <InputGroup>
                      <Input
                        value={paypal_email}
                        name="paypal_email"
                        type="string"
                        placeholder="enter courier paypal info"
                        onChange={this.onEmailChange}
                      />
                    </InputGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              className="error-submit"
              disabled={!isEnabled}
              variant="contained"
              color="primary"
              size={"medium"}
              type="button"
              onClick={this.createNewCourier}
            >
              Create
            </Button>
          </Paper>
        </div>
      </div>
    );
  }
}

export default connect("store")(CourierModal);
