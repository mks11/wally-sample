import React, { Component } from "react";
import ReceiptCapture from "./ReceiptCapture";
import { API_ADMIN_GET_RECEIPTS } from "../../../config";
import { connect } from "../../../utils";
import { Container, Col, Row, Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

const axios = require("axios");

class Receipts extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newReceipt: false,
      tableView: true,
      enlageImage: false,
      enlargeImageFile: "",
      currentDate: ""
    };
    this.adminStore = this.props.store.admin;
    this.userStore = this.props.store.user;
  }

  // When Mounting Set Receipts array to today's Receipts
  componentDidMount() {

    this.userStore.getStatus(true)
      .then((status) => {
          const user = this.userStore.user
          
          if( status && (user.type === 'admin' || user.type === 'super-admin' || user.type === 'tws-ops')){
              let momentDate = moment().format("YYYY[-]MM[-]DD");
              let formattedDate = momentDate + "%202:00-8:00PM";
              this.setState({ currentDate: momentDate });
              this.adminStore.getShopLocations(formattedDate);
              this.adminStore.getDailyReceipts(formattedDate);
          } else {
              this.props.store.routing.push('/')
          }
      })
      .catch((error) => {
          this.props.store.routing.push('/')
      })
  }

  // Show Add new Receipt Form
  handleAddForm = () => {
    this.setState({
      newReceipt: true,
      tableView: false
    });
  };
  // Show Table of Receipts View
  handleTableView = () => {
    this.setState({
      newReceipt: false,
      tableView: true
    });
  };
  // Show user Selected Image enlarged
  enlargeImage = e => {
    this.setState({
      enlargeImage: true,
      enlargeImageFile: e.target.src
    });
  };
  // Escape enlarged image
  handleOuterClick = () => {
    this.setState({
      enlargeImage: false,
      enlargeImageFile: ""
    });
  };

  render() {
    const { locations } = this.adminStore;
    const { receipts } = this.adminStore;
    return (
      <div>
        <Container>
          <div className="switchButtons">
            {/* Buttons For Selecting New Receipt or Table of Daily Receipts View */}
            <button
              className={
                "add-button " + (this.state.tableView ? "selected" : "")
              }
              onClick={this.handleTableView}
            >
              Receipt Table View
            </button>
            <button
              className={
                "add-button " + (this.state.newReceipt ? "selected" : "")
              }
              onClick={this.handleAddForm}
            >
              Add New Receipt
            </button>
          </div>
          {/* Shows New Receipt Form */}
          <div>
            {this.state.newReceipt && (
              <ReceiptCapture
                handleTableView={this.handleTableView}
                locations={locations}
                adminStore={this.adminStore}
              />
            )}
          </div>
          {/* Shows Enlarged Image */}
          <div>
            {this.state.enlargeImage && (
              <Col
                style={{ maxHeight: "80%", maxWidth: "85%", margin: "auto" }}
                align="center"
              >
                <img
                  style={{ maxHeight: "700px", maxWidth: "80%" }}
                  src={this.state.enlargeImageFile}
                  alt="enlarged"
                />
                <Button onClick={this.handleOuterClick}>Close Image</Button>
              </Col>
            )}
            {/* Shows Table of Daily Receipts */}
            {this.state.tableView && (
              <Paper elevation={1} className={"scrollable-table"}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Location
                      </TableCell>

                      <TableCell
                        align="center"
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Image
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipts.map(receipt => {
                      return (
                        <TableRow key={receipt._id}>
                          <TableCell align="center">
                            {receipt.location}
                          </TableCell>

                          <TableCell align="center">
                            <img
                              className="prev-img"
                              src={
                                "https://the-wally-shop-app.s3.us-east-2.amazonaws.com/" +
                                "daily-receipts" +
                                "/" +
                                this.state.currentDate +
                                "/" +
                                receipt.filename
                              }
                              onClick={this.enlargeImage}
                              alt={receipt.filename}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </div>
        </Container>
        <div style={{ margin: "10px" }}>
          <Col md="12" align="center" className="tl-3">
            {/* need to add link to capture view */}
            <Link to="/manage/shopping-app-3">
              <Button className="btn-sm"> Back To Step 3 </Button>
            </Link>
          </Col>
        </div>
      </div>
    );
  }
}

export default connect("store")(Receipts);
