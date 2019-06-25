import React, { Component } from "react";
import ReceiptCapture from "./ReceiptCapture";
import { connect } from "../../../utils";
import "./Receipt.css";
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
      receipts: [],
      enlageImage: false,
      enlargeImageFile: "",
      currentDate: ""
    };
  }

  // When Mounting Set Receipts array to today's Receipts
  componentDidMount() {
    let momentDate = moment().format("YYYY[-]MM[-]DD");
    let formattedDate = momentDate + "%202:00PM-8:00PM";
    this.setState({ currentDate: momentDate });

    axios
      .get(
        `http://localhost:4001/api/admin/shopping/receipt?timeframe=${formattedDate}`
      )
      .then(response => {
        const sortedReceipts = response.data.receipts.sort(function(a, b) {
          return a.createdAt - b.createdAt;
        });
        // Newest Receipts at top
        this.setState({ receipts: [...sortedReceipts.reverse()] });
        console.log(response.data.receipts);
      })
      .catch(error => {
        console.log(error);
      });
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
              <ReceiptCapture handleTableView={this.handleTableView} />
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
                    {this.state.receipts.map(receipt => {
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
//export default Receipts;
