// Node Modules
import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";

// Utilities
import { connect, formatMoney } from "../utils";

// Components
import Title from "../common/page/Title";
import ReportModal from "./orders/ReportModal";
import ReportSuccessModal from "./orders/ReportSuccessModal";
import {
  Container,
  Grid,
  Divider,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";

const Order = styled(Paper)`
  padding: 2rem;
`;

class Orders extends Component {
  constructor(props) {
    super(props);
    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.modalStore = this.props.store.modal;
    this.orderStore = this.props.store.order;
    this.loadingStore = this.props.store.loading;
    this.snackbarStore = this.props.store.snackbar;
  }

  componentDidMount() {
    this.userStore.getStatus().then((status) => {
      if (!status) {
        this.modalStore.toggleModal("login");
        this.props.store.routing.push("/main");
        return;
      }
      this.loadData();
    });
  }

  loadData() {
    this.loadingStore.show();
    this.orderStore
      .getOrders(this.userStore.getHeaderAuth())
      .catch((err) => {
        this.snackbarStore.openSnackbar(
          err.message
            ? err.message
            : "Oops, something went wrong while getting your order history 😧",
          "error"
        );
      })
      .finally(() => {
        setTimeout(() => this.loadingStore.hide(), 300);
      });
  }

  countItems(data = []) {
    let total = 0;
    for (const d of data) {
      total += parseFloat(d.customer_quantity);
    }
    return total;
  }

  printItems(data = []) {
    let items = [];
    for (const d of data) {
      items.push(d.product_name);
    }
    return items.join(", ");
  }

  printPackaging(data = []) {
    let items = [];
    for (const d of data) {
      items.push(d.type);
    }
    return items.join(", ");
  }

  render() {
    return (
      <div className="App">
        <Title content="Orders" />
        <section className="page-section aw--orders">
          <Container maxdWidth="lg">
            <Grid container spacing={4}>
              {this.orderStore.orders && this.orderStore.orders.length > 0
                ? this.orderStore.orders.map((item, idx) => (
                    <Grid item xs={12} md={6} xl={4}>
                      <Order key={`${item._id}-${idx}`} elevation={3}>
                        <Typography variant="h2" gutterBottom>
                          {`${item.status === "returned" ? "Return" : "Order"}`}{" "}
                          {item._id}
                        </Typography>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary">
                              {item.cart_items ? "Placed" : "Returned"}{" "}
                              {item.createdAt
                                ? moment(
                                    item.createdAt.substring(0, 10)
                                  ).format("MMM DD, YYYY")
                                : moment(
                                    item.return_date &&
                                      item.return_date.substring(0, 10)
                                  ).format("MMM DD, YYYY")}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              color="textSecondary"
                              gutterBottom
                            >
                              {item.total && formatMoney(item.total / 100)}
                              {item.total_credit &&
                                formatMoney(item.total_credit / 100)}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider />
                        {/* <table>
                          <thead>
                            <tr>
                              <th className="pr-4"></th>
                              <th className="pr-4">Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {item.cart_items ? (
                                <td>{item.cart_items.length}</td>
                              ) : (
                                <td>
                                  {item.returns ? item.returns.length : 0}
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table> */}
                        <br></br>
                        <div className="text-bold order-item-content">
                          {item.tracking_number ? (
                            <>
                              <Typography variant="h3" gutterBottom>
                                {item.tracking_number.length === 1
                                  ? "Tracking Number"
                                  : "Tracking Numbers"}
                                :
                              </Typography>
                              <Grid container>
                                {item.tracking_number.map(
                                  (trackingNumber, idx) => {
                                    let trackingUrl;
                                    if (
                                      item.tracking_number.length ===
                                      item.tracking_url.length
                                    ) {
                                      trackingUrl = item.tracking_url[idx];
                                    }
                                    return (
                                      <Grid
                                        key={`order-${item._id}-${idx}`}
                                        item
                                        xs={12}
                                      >
                                        {trackingUrl ? (
                                          <Link
                                            href={trackingUrl}
                                            target="_blank"
                                            rel="noopenner noreferrer"
                                          >
                                            <Typography
                                              variant="body1"
                                              gutterBottom
                                            >
                                              {trackingNumber}
                                            </Typography>
                                          </Link>
                                        ) : (
                                          <Typography
                                            variant="body1"
                                            gutterBottom
                                          >
                                            {trackingNumber}
                                          </Typography>
                                        )}
                                      </Grid>
                                    );
                                  }
                                )}
                              </Grid>
                            </>
                          ) : null}
                        </div>
                        <div className="order-item-content-wrapper">
                          {item.cart_items ? (
                            <div className="order-item-content">
                              {this.printItems(item.cart_items)}
                            </div>
                          ) : (
                            <div className="order-item-content">
                              {this.printPackaging(item.returns)}
                            </div>
                          )}
                          <a
                            onClick={(e) => this.orderStore.toggleReport(item)}
                            className="text-report text-blue"
                          >
                            Report a Problem
                          </a>
                        </div>
                      </Order>
                    </Grid>
                  ))
                : null}
            </Grid>
          </Container>
        </section>
        <ReportModal />
        <ReportSuccessModal />
      </div>
    );
  }
}

export default connect("store")(Orders);
