import React, { Component } from "react";
import { Container, Col } from "reactstrap";
import Title from "../common/page/Title";
import ManageTabs from "./manage/ManageTabs";
import { connect } from "../utils";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import ViewSingleOrder from "./orders/ViewSingleOrder";
import moment from "moment";

class ManageOrders extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;

    this.state = {
      activeTab: "1",
      timeframe: null,
      selectedOrder: null,
      singleOrderOpen: false,
      busy: false,
    };
  }

  componentDidMount() {
    this.userStore
      .getStatus(true)
      .then(status => {
        const user = this.userStore.user;
        if (
          !status ||
          !["admin", "super-admin", "tws-ops"].includes(user.type)
        ) {
          this.props.store.routing.push("/");
        } else {
          this.loadOrders();
          this.adminStore.getPackagings();
        }
      })
      .catch(error => {
        this.props.store.routing.push("/");
      });
  }

  loadOrders = () => {
    const { busy } = this.state;

    if (busy) return
    this.setState({ busy: true })

    let timeframe = `${moment().format("YYYY-MM-DD")} 2:00-8:00PM`;
    const options = this.userStore.getHeaderAuth();

    this.adminStore.getOrders("all", timeframe, options)
      .finally(() => {
        this.setState({ busy: false })
      })
  };

  onTimeFrameSelect = timeframe => {
    this.setState(
      {
        timeframe
      },
      () => this.loadOrders()
    );
  };

  toggleSingleOrderView = ({ order }) => {
    if (order) {
      this.setState({ singleOrderOpen: true, selectedOrder: order });
    } else {
      this.setState({ singleOrderOpen: false, selectedOrder: null });
      this.loadOrders();
    }
  };

  render() {
    if (!this.userStore.user) return null;
    const { packagings } = this.adminStore;
    const { singleOrderOpen } = this.state;
    const { orders } = this.adminStore;
    const user = this.userStore.user;
    return (
      <div className="App">
        <ManageTabs page="fulfillment" />
        <Title content="Orders Portal" />
        {!singleOrderOpen ? (
          <React.Fragment>
            <section className="page-section pt-1 fulfillment-page">
              <Container>
                <div className="user-header">
                  <Col md="6" sm="12">
                    <div className="mb-4">{user.name}</div>
                  </Col>
                </div>
              </Container>
            </section>

            <section className="page-section pt-1 fulfillment-page">
              <Container>
                <Paper elevation={1} className={"scrollable-table"}>
                  <Table className="order-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Letter</TableCell>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders &&
                        orders.length > 0 &&
                        orders.map(order => {
                          return (
                            <TableRow
                              key={order._id}
                              className={
                                order.status === "packaged"
                                  ? `row ${order.status}`
                                  : "order-row"
                              }
                              onClick={() =>
                                this.toggleSingleOrderView({ order })
                              }
                            >
                              <TableCell className={order.order_letter}>
                                {order.order_letter ? order.order_letter : ""}
                              </TableCell>
                              <TableCell>{order._id}</TableCell>
                              <TableCell className={"text-capitalize"}>
                                {order.status}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              </Container>
            </section>
          </React.Fragment>
        ) : (
          <ViewSingleOrder
            toggle={this.toggleSingleOrderView}
            selectedOrder={this.state.selectedOrder}
            packagings={packagings}

          />
        )}
      </div>
    );
  }
}

export default connect("store")(ManageOrders);
