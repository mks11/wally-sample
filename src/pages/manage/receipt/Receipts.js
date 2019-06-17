import React, { Component } from "react";
import ReceiptCapture from "./ReceiptCapture";
import { connect } from "../../../utils";
import "./Receipt.css";

const axios = require("axios");

class Receipts extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newReceipt: false,
      tableView: true,
      receipts: [],
      enlageImage: false,
      enlargeImageFile: ""
    };
  }

  // When Mounting Set Receipts array to today's Receipts
  componentDidMount() {
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    function pad(n) {
      return n < 10 ? "0" + n : n;
    } // I could easily extract this date into a file with other similar functions.
    var yyyymmdd = year + "-" + pad(month + 1) + "-" + pad(date);

    axios
      .get(
        `http://localhost:4001/api/admin/shopping/receipt?timeframe=${yyyymmdd}%202:00PM-8:00PM`
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
        <div className="switchButtons">
          {/* Buttons For Selecting New Receipt or Table of Daily Receipts View */}
          <button
            className={"add-button " + (this.state.tableView ? "selected" : "")}
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
            <div className="enlargedImg">
              <img
                className="bigImgSelf"
                src={this.state.enlargeImageFile}
                alt="enlarged"
              />
              <button onClick={this.handleOuterClick}>X</button>
            </div>
          )}
          {/* Shows Table of Daily Receipts */}
          {this.state.tableView && (
            <div className="receipt-outer">
              <div className="table-style">
                {/* Table Header */}
                <div className="head-row-style">
                  <div className="table-item">Location</div>
                  <div className="table-item">Date </div>
                  <div className="table-item">Image</div>
                </div>
                {/* Table Rows Mapped from Array */}
                {this.state.receipts.map(receipt => {
                  return (
                    <div className="row-style" key={receipt._id}>
                      <div className="table-item">{receipt.location}</div>
                      <div className="table-item">{receipt.shop_date}</div>
                      <div className="table-item">
                        <img
                          className="prev-img"
                          src={
                            "https://the-wally-shop-app.s3.us-east-2.amazonaws.com/" +
                            receipt.filename
                          }
                          onClick={this.enlargeImage}
                          alt={receipt.filename}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect("store")(Receipts);
//export default Receipts;
