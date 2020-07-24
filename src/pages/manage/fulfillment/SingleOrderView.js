import React, { Component } from "react";
import { connect } from "../../../utils";
import {
  Container,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import { Col, Row, ControlLabel } from "react-bootstrap";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import CartItem from "./CartItem";
import { BASE_URL } from "../../../config";

class SingleOrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrder: props.selectedOrder,
      cart_items: props.selectedOrder.cart_items,
      packagings: props.packagings.map(packaging => {
        return { ...packaging, quantity: 0 };
      }),
      packagingUsed: props.selectedOrder.packaging_used.map(item => {
        return { ...item, type: item.type };
      }),
      originalSubTotal: props.selectedOrder.cart_items
        .map(item => item.initial_product_price * item.final_quantity)
        .reduce((acc, curr) => {
          return acc + curr;
        }, 10),
      currentSubTotal: props.selectedOrder.cart_items
        .map(item => item.product_price * item.final_quantity)
        .reduce((acc, curr) => {
          return acc + curr;
        }, 10),
      confirmModalOpen: false
    };
    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
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

  handleWeightChange = update => {
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
      });
    });
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

  toggleConfirmModal = () => {
    this.setState({ confirmModalOpen: !this.state.confirmModalOpen });
  };

  handleOrderUpdate = payload => {
    let orderId = this.state.selectedOrder._id;
    let cart_items = this.state.cart_items;
    let packagings = payload.packagings;
    let auth = this.userStore.getHeaderAuth();
    fetch(`${BASE_URL}/api/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth.headers.Authorization
      },
      body: JSON.stringify({
        cart_items: cart_items,
        packagings
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  submitPackaging = () => {
    const { packagings, cart_items, selectedOrder } = this.state;
    const { onSubmit } = this.props;
    const item_quantities = cart_items.map(item => {
      return {
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.missing ? 0 : Number(item.final_quantity)
      };
    });

    const newPackagings = packagings.map(packaging => {
      return {
        type: packaging.type,
        quantity: Number(packaging.quantity)
      };
    });
    const payload = {
      item_quantities,
      packagings: newPackagings
    };
    const options = this.userStore.getHeaderAuth();

    this.adminStore.packageOrder(selectedOrder._id, payload, options);
    onSubmit && onSubmit();
    this.props.toggle({});
  };

  updateOrder = async () => {
    const { selectedOrder } = this.state;
    const items = selectedOrder.cart_items.map(item => {
      return {
        product_name: item.product_name,
        missing: item.missing,
        final_quantity: item.missing ? 0 : Number(item.final_quantity),
        weight: item.weight
      };
    });

    const packagings = selectedOrder.packaging_used.map(packaging => {
      return {
        type: packaging.type,
        quantity: Number(packaging.quantity)
      };
    });

    const payload = {
      cart_items: items,
      packagings: packagings
    };

    await this.setState(
      {
        selectedOrder: {
          ...this.state.selectedOrder,
          cart_items: payload.cart_items,
          packagings: payload.newPackagings
        }
      },
      async () => {
        await this.handleOrderUpdate(payload);
      }
    );
  };

  render() {
    const {
      cart_items,
      selectedOrder,
      originalSubTotal,
      currentSubTotal
    } = this.state;
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
          <h2>Single Order View</h2>
          <hr />
          <Paper elevation={1} className={"scrollable-table"}>
            <Table className={"packaging-table"} padding={"dense"}>
              <TableHead>
                <TableRow>
                  <TableCell>Missing</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Substitute For</TableCell>
                  <TableCell>Substite Preference</TableCell>
                  <TableCell>Producer</TableCell>
                  <TableCell>Shop</TableCell>
                  <TableCell>Initial Price</TableCell>
                  <TableCell>Final Price</TableCell>
                  <TableCell>Initial Quantity</TableCell>
                  <TableCell>Final Quantity</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                  <TableCell>Initial Total</TableCell>
                  <TableCell>Final Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart_items.map((cart_item, i) => (
                  <CartItem
                    key={cart_item._id}
                    order_id={selectedOrder._id}
                    cart_item={cart_item}
                    index={i}
                    onWeightStateChange={this.handleWeightChange}
                    saveCartRow={this.saveCartRow}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
          <FormGroup className={"single-order-total"}>
            <Row>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Current Subtotal:</strong>
              </Col>
              <Col sm={4}>${Math.round(currentSubTotal) / 100}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Original Subtotal:</strong>
              </Col>
              <Col sm={4}>${Math.round(originalSubTotal) / 100}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Promo Discount</strong>
              </Col>
              <Col sm={4}>${selectedOrder.promo_discount / 100}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Applied Store Credit</strong>
              </Col>
              <Col sm={4}>${selectedOrder.applied_store_credit / 100}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Tax Amount</strong>
              </Col>
              <Col sm={4}>${selectedOrder.tax_amount}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Tip Amount</strong>
              </Col>
              <Col sm={4}>${selectedOrder.tip_amount / 100}</Col>
              <Col componentClass={ControlLabel} sm={2}>
                <strong>Total</strong>
              </Col>
              <Col sm={4}>${selectedOrder.total / 100}</Col>
            </Row>
          </FormGroup>
          <Table className={"packaging-table"}>
            <TableBody>
              {selectedOrder.packaging_used.map((packaging, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <strong>{packaging.type}</strong>
                  </TableCell>
                  <TableCell>
                    <Input
                      className="packaging-quantity"
                      name="packaging quantity"
                      value={packaging.quantity}
                      type="number"
                      onChange={e => this.onChangePackaging(e, packaging._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="nav-buttons">
            <Button
              variant="contained"
              color="primary"
              size={"medium"}
              type={"button"}
              onClick={this.toggleConfirmModal}
            >
              Package Order
            </Button>
            <Button
              variant="contained"
              color="primary"
              size={"medium"}
              type={"button"}
              onClick={this.updateOrder}
            >
              Update Order
            </Button>
          </div>
        </Container>
        <Modal
          isOpen={this.state.confirmModalOpen}
          toggle={this.toggleConfirmModal}
          className="single-order-modal"
        >
          <ModalHeader toggle={this.toggleConfirmModal}>
            Confirm Packaging
          </ModalHeader>
          <ModalBody>Please check and confirm the packaging</ModalBody>
          <ModalFooter>
            <Button
              variant="contained"
              color="primary"
              size={"large"}
              type={"button"}
              onClick={this.submitPackaging}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    );
  }
}

export default connect("store")(SingleOrderView);
