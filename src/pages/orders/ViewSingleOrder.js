import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Container,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import CartItemOrder from "./CartItemOrder";
import { BASE_URL } from "../../config";

class ViewSingleOrder extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
    this.modalStore = props.store.modal;

    const selectedOrder = props.selectedOrder;

    this.state = {
      selectedOrder,
      cart_items: selectedOrder.cart_items,
      packagings: selectedOrder.packaging_used.map(p => ({ ...p })),
      confirmModalOpen: false,
    };
  }

  toggleConfirmModal = () => {
    this.setState({ confirmModalOpen: !this.state.confirmModalOpen });
  };

  handleOrderUpdate = () => {
    const { selectedOrder, cart_items } = this.state;

    const orderId = selectedOrder._id;
    const packagings = selectedOrder.packaging_used;
    const auth = this.userStore.getHeaderAuth();

    return fetch(`${BASE_URL}/api/order/${orderId}`, {
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
      .then(res => console.log(res))
      .catch(e => console.log(e));
  };

  onChangePackaging = (e, type) => {
    const { selectedOrder } = this.state;

    const packagings = selectedOrder.packaging_used.map(p => {
      if (p.type === type) {
        return { ...p, quantity: e.target.value };
      }
      return p;
    });

    this.setState({
      selectedOrder: {
        ...selectedOrder,
        packaging_used: packagings
      }
    });
  };

  handlePackageSubmit = async () => {
    const { selectedOrder } = this.state;
    const { onSubmit } = this.props;

    const newPackagings = selectedOrder.packaging_used.map(p => {
      return {
        type: p.type,
        quantity: Number(p.quantity)
      };
    });

    await this.setState(
      {
        selectedOrder: {
          ...selectedOrder,
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
        console.log("end of callstate", cart_items);
      });
    });
  };

  render() {
    const { cart_items, selectedOrder } = this.state;
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
                {cart_items.map(item => (
                  <CartItemOrder
                    key={item._id}
                    order_id={selectedOrder._id}
                    cart_item={item}
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
                packaging.type === "Milk Bottle" ||
                packaging.type === "Stasher Bag" ||
                packaging.type === "FBW Packaging" ||
                packaging.type === "Muslin Bag" ||
                packaging.type === "Mesh Bag" ||
                packaging.type === "Mason Jar" ||
                packaging.type === "Tote Bag" ? (
                  <TableRow key={i}>
                    <TableCell>
                      {
                        packaging.type === "Milk Bottle" ||
                        packaging.type === "Stasher Bag" ||
                        packaging.type === "FBW Packaging" ||
                        packaging.type === "Muslin Bag" ||
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

export default connect("store")(ViewSingleOrder);
