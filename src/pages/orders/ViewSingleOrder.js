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
      packagings: props.packagings.map(packaging => {
        return { ...packaging };
      }),
      packaging_used: props.selectedOrder.packaging_used.map(item => {
        return { ...item, type: item.type, quantity: item.quantity };
      }),
      confirmModalOpen: false
    };
    this.userStore = this.props.store.user;
    this.adminStore = this.props.store.admin;
  }

  saveCartRow = (cart_item, index) => {
    const { cart_items } = this.state;
    cart_items.map((item, i) => {
      if (i === index) {
        return cart_item;
      } else {
        return item;
      }
    });
  };

  toggleConfirmModal = () => {
    this.setState({ confirmModalOpen: !this.state.confirmModalOpen });
  };

  handleOrderUpdate = payload => {
    let orderId = this.state.selectedOrder._id;
    let cart_items = this.state.cart_items;
    let cartItems = payload.cart_items;
    console.log("cartItems");
    console.log(cart_items);
    console.log("payload");
    console.log(payload.packagings);
    let packagings = this.state.selectedOrder.packaging_used;
    console.log("APICALL");
    console.log(packagings);
    let API_TEST_URL = "http://localhost:4001";
    fetch(`${API_TEST_URL}/api/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart_items: cartItems,
        packagings
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  onChangePackaging = (e, id) => {
    const packagings = this.state.selectedOrder.packaging_used.map(data => {
      if (data._id === id) {
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

  handleSubmit = () => {
    const { packaging_used, cart_items, selectedOrder } = this.state;
    const { onSubmit } = this.props;
    const items = selectedOrder.cart_items.map(item => {
      return {
        product_id: item.product_id,
        product_name: item.product_name,
        missing: item.missing,
        product_error_reason: item.product_error_reason,
        final_quantity: item.missing ? 0 : Number(item.final_quantity),
        weight: item.weight
      };
    });
    console.log("PUSED", selectedOrder.packaging_used);
    const newPackagings = selectedOrder.packaging_used.map(packaging => {
      return {
        type: packaging.type,
        quantity: Number(packaging.quantity)
      };
    });

    const payload = {
      cart_items: items,
      packagings: newPackagings
    };
    console.log("payload");
    console.log(payload.packagings);
    const options = this.userStore.getHeaderAuth();

    // this.adminStore.packageOrder(selectedOrder._id, payload, options);
    onSubmit && onSubmit();
    this.handleOrderUpdate(payload);
    this.setState({
      selectedOrder: {
        ...this.state.selectedOrder,
        cart_items: payload.cart_items,
        packagings: payload.newPackagings
      }
    });
    this.props.toggle({});
  };

  render() {
    const {
      cart_items,
      selectedOrder,
      packagings,
      packaging_used,
      originalSubTotal,
      currentSubTotal
    } = this.state;
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
                  <TableCell>Missing</TableCell>
                  <TableCell>Error Code</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart_items.map((cart_item, i, order_id) => (
                  <CartItemOrder
                    key={cart_item._id}
                    order_id={selectedOrder._id}
                    cart_item={cart_item}
                    index={i}
                    saveCartRow={this.saveCartRow}
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
                packaging.type === "Tote Bag" ? (
                  <TableRow key={i}>
                    <TableCell>
                      {packaging.type === "Muslin Bag" ||
                      packaging.type === "Mesh Bag" ||
                      packaging.type === "Tote Bag" ? (
                        <strong>{packaging.type}</strong>
                      ) : (
                        <strong className="hide" style={hideRow} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        name="packaging quantity"
                        value={
                          packaging.quantity === 0 ||
                          packaging.quantity === null
                            ? 0
                            : packaging.quantity
                        }
                        type="number"
                        onChange={e => this.onChangePackaging(e, packaging._id)}
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
              onClick={this.handleSubmit}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    );
  }
}

export default connect("store")(ViewSingleOrder);
