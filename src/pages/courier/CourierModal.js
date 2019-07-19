import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Input,
  InputGroup,
} from "reactstrap";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { BASE_URL } from "../../config";

class CourierModal extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
    this.modalStore = props.store.modal;

    this.state = {
      name: '',
      paypal_email: '',
      busy: false,
    };
  }

  onNameChange = e => {
    this.setState({ name: e.target.value });
  };

  onEmailChange = e => {
    this.setState({ paypal_email: e.target.value });
  };

  createNewCourier = e => {
    const { name, paypal_email: paypal, busy } = this.state;

    if (busy) return
    this.setState({ busy: true })

    const { courierPhoneNumber: telephone_number, onClose } = this.props;
    const options = this.userStore.getHeaderAuth()

    this.adminStore.createNewCourier({
      name,
      telephone_number,
      paypal,
    }, options)
      .then(() => {
        this.setState({ busy: false })
        onClose && onClose();
      })
      .catch(() => {
        this.modalStore.toggleModal('error')
        this.setState({ busy: false })
      })

    e.stopPropagation();
  };

  render() {
    const { name, paypal_email, busy } = this.state;
    const { courierPhoneNumber, isOpen } = this.props;

    if (!isOpen) {
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
              disabled={!isEnabled && !busy}
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
