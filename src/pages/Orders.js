import React, { Component } from "react";
import Title from "../common/page/Title";
import { connect, formatMoney } from "../utils";
import moment from "moment";
import { Link } from "@material-ui/core";
import ReportModal from "./orders/ReportModal";
import ReportSuccessModal from "./orders/ReportSuccessModal";

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
            : "Oops, something went wrong while getting your order history 😧"
        );
      })
      .finally(() => {
        this.snackbarStore.openSnackbar(
          // err.message
          // ? err.message
          "Oops, something went wrong while getting your order history 😧",
          "error"
        );
        setTimeout(() => this.loadingStore.hide());
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
          <div className="container">
            {this.orderStore.orders && this.orderStore.orders.length > 0
              ? this.orderStore.orders.map((item, key) => (
                  <div className="order-item mt-2 mb-5" key={key}>
                    <table>
                      <thead>
                        <tr>
                          <th className="pr-4">
                            {item.cart_items
                              ? "Order Placed"
                              : "Packaging Returned"}
                          </th>
                          <th className="pr-4">Items</th>
                          <th className="pr-4">Total</th>
                          <th className="pr-4">Tracking Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {item.createdAt ? (
                            <td>
                              {moment(item.createdAt.substring(0, 10)).format(
                                "MMM DD, YYYY"
                              )}
                            </td>
                          ) : (
                            <td>
                              {moment(
                                item.return_date &&
                                  item.return_date.substring(0, 10)
                              ).format("MMM DD, YYYY")}
                            </td>
                          )}
                          {item.cart_items ? (
                            <td>{item.cart_items.length}</td>
                          ) : (
                            <td>{item.returns ? item.returns.length : 0}</td>
                          )}
                          {item.total ? (
                            <td>
                              {item.total
                                ? formatMoney(item.total / 100)
                                : "$0.00"}
                            </td>
                          ) : (
                            <td>
                              {item.total_credit
                                ? formatMoney(item.total_credit / 100)
                                : "$0.00"}
                            </td>
                          )}
                          {item.tracking_number ? (
                            <td>
                              <Link href={item.tracking_url}>
                                {item.tracking_number}
                              </Link>
                            </td>
                          ) : null}
                        </tr>
                      </tbody>
                    </table>
                    <hr className="my-1" />
                    <div className="text-bold order-item-content">
                      {`${item.status === "returned" ? "Return" : "Order"}`} #:{" "}
                      {item._id}
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
                  </div>
                ))
              : null}
          </div>
        </section>
        <ReportModal />
        <ReportSuccessModal />
      </div>
    );
  }
}

export default connect("store")(Orders);
