import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import { Col, Row, ControlLabel, FormControl, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeftOutlined";
import ArrowRight from "@material-ui/icons/KeyboardArrowRightOutlined";
import Typography from "@material-ui/core/Typography/Typography";
import Select from "react-select";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import CartItemOrder from "./CartItemOrder";

class ViewSingleOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: props.selectedOrder,
      cart_items: props.selectedOrder.cart_items,
      packagings: props.selectedOrder.packaging_used.map(packaging => {
        return { ...packaging };
      }),
      confirmModalOpen: false
    };
  }

  toggleConfirmModal = () => {
    this.setState({ confirmModalOpen: !this.state.confirmModalOpen });
  };

  handleOrderUpdate = payload => {
    let orderId = this.state.selectedOrder._id;
    let cart_items = this.state.cart_items;
    let selectedOrder = this.state.selectedOrder;
    let packagings = this.state.selectedOrder.packaging_used;
    let API_TEST_URL = "http://localhost:4001";
    return fetch(`${API_TEST_URL}/api/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart_items: cart_items,
        packagings
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  onChangePackaging = (e, type) => {
    const packagings = this.state.selectedOrder.packaging_used.map(data => {
      if (data.type === type) {
        return { ...data, quantity: e.target.value };
      }
      return data;
    });
    this.setState({
      selectedOrder: {
        ...this.state.selectedOrder,
        packaging_used: packagings
      }
    });
  };

  handlePackageSubmit = async () => {
    const { packaging_used, selectedOrder } = this.state;
    const { onSubmit } = this.props;

    const newPackagings = selectedOrder.packaging_used.map(packaging => {
      return {
        type: packaging.type,
        quantity: Number(packaging.quantity)
      };
    });

    await this.setState(
      {
        selectedOrder: {
          ...this.state.selectedOrder,
          packagings: newPackagings
        }
      },
      async () => {
        await this.handleOrderUpdate(newPackagings);
        this.props.toggle({});
        onSubmit && onSubmit();
      }
    );
  };

  handleCartStateChange = update => {
    const { cart_items, selectedOrder } = this.state;
    return new Promise(done => {
      this.setState(({ cart_items }) => ({
        cart_items: cart_items.map(item =>
          item._id === update._id
            ? {
                ...item,
                ...update
              }
            : item
        )
      }));
      this.setState({}, () => {
        done();
        console.log("end of callstate", this.state.cart_items);
      });
    });
  };

  render() {
    const { cart_items, selectedOrder, packagings } = this.state;
    const hideRow = { display: "none" };
    return (
      <section className="page-section pt-1 single-order">
        <Container>
          <div className="mb-4">
            <Button
              variant="contained"
              color="default"
              onClick={this.props.toggle}
            >
              <CloseIcon />
              <Typography>Close</Typography>
            </Button>
          </div>
          <h2>Order #{selectedOrder.order_letter}</h2>
          <hr />
          <Paper elevation={1} className={"scrollable-table"}>
            <Table className={"packaging-table"} padding={"dense"}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Producer</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Initial Quantity</TableCell>
                  <TableCell>Final Quantity</TableCell>
                  <TableCell>Missing?</TableCell>
                  <TableCell>Error?</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart_items.map((cart_item, i, order_id) => (
                  <CartItemOrder
                    key={cart_item._id}
                    order_id={selectedOrder._id}
                    cart_item={cart_item}
                    onCartStateChange={this.handleCartStateChange}
                    onSetMissing={this.handleSetMissing}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Table className={"packaging-table"}>
            <TableBody>
              {selectedOrder.packaging_used.map((packaging, i) =>
                packaging.type === "Muslin Bag" ||
                packaging.type === "Mesh Bag" ||
                packaging.type === "Mason Jar" ||
                packaging.type === "Tote Bag" ? (
                  <TableRow key={i}>
                    <TableCell>
                      {packaging.type === "Muslin Bag" ||
                      packaging.type === "Mesh Bag" ||
                      packaging.type === "Mason Jar" ||
                      packaging.type === "Tote Bag" ? (
                        <strong>{packaging.type}</strong>
                      ) : (
                        <strong className="hide" style={hideRow} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        name="packaging quantity"
                        value={packaging.quantity}
                        type="number"
                        onChange={e =>
                          this.onChangePackaging(e, packaging.type)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow style={hideRow} key={i}>
                    <TableCell>
                      <Input />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <div className="nav-buttons">
            <Button
              variant="contained"
              color="primary"
              size={"large"}
              type={"button"}
              onClick={this.toggleConfirmModal}
            >
              Submit
            </Button>
          </div>
        </Container>
        <Modal
          isOpen={this.state.confirmModalOpen}
          toggle={this.toggleConfirmModal}
          className="single-order-modal"
        >
          <ModalHeader toggle={this.toggleConfirmModal}>
            Confirm Order
          </ModalHeader>
          <ModalBody>Please check and confirm order</ModalBody>
          <ModalFooter>
            <Button
              variant="contained"
              color="primary"
              size={"large"}
              type={"button"}
              onClick={this.handlePackageSubmit}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    );
  }
}

export default ViewSingleOrder;
