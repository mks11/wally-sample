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
        return { ...packaging, quantity: 0 };
      }),
      packagings: props.packagings.map(packaging => {
        return { ...packaging };
      }),
      packagingUsed: props.selectedOrder.packaging_used.map(item => {
        return { ...item, type: item.type };
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

  onChangePackaging = (e, i) => {
    const packagings = [...this.state.packagings];
    packagings[i] = { ...packagings[i], quantity: e.target.value };
    this.setState({ packagings });
  };

  toggleConfirmModal = () => {
    this.setState({ confirmModalOpen: !this.state.confirmModalOpen });
  };

  handleOrderUpdate = () => {
    let orderId = this.state.selectedOrder._id;
    let cartItems = this.state.cart_items;
    let packagings = this.state.packagings;
    let API_TEST_URL = "http://localhost:4001";
    fetch(`${API_TEST_URL}/api/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cartItems,
        packagings
      })
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  };

  handleSubmit = () => {
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

  render() {
    const {
      cart_items,
      selectedOrder,
      packagings,
      packagingUsed,
      originalSubTotal,
      currentSubTotal
    } = this.state;
    const packagingArr = packagings.reduce((acc, packaging) => {
      const pUsed = packagingUsed.find(e => e.type === packaging.type);
      if (pUsed)
        acc[packaging.type] = { ...packaging, quantity: pUsed.quantity };
      else acc[packaging.type] = { ...packaging, quantity: 0 };
      return acc;
    }, []);
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
          <h2>View</h2>
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
                  <TableCell>Producer</TableCell>
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
              {packagings.map((packaging, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <strong>{packaging.type}</strong>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Enter Quantity"
                      value={packaging.quantity}
                      type={"number"}
                      onChange={e => this.onChangePackaging(e, i)}
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
              size={"large"}
              type={"button"}
              onClick={this.toggleConfirmModal}
            >
              Package Order
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
