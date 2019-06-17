import React, { Component } from "react";
import ReceiptCapture from "./ReceiptCapture";
import "./Receipt.css";

const axios = require("axios");

class Receipts extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newReceipt: false,
      tableView: true,
      receipts: [],
      currentDate: ""
    };
  }

  componentDidMount() {
    axios
      .get(
        "http://localhost:4001/api/admin/shopping/receipt?timeframe=01-04-2019 8:00PM-10:00PM"
      )
      .then(response => {
        this.setState({ receipts: [...response.data.receipts] });
        console.log(response.data.receipts);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleAddForm = () => {
    this.setState({
      newReceipt: true,
      tableView: false
    });
  };

  handleTableView = () => {
    this.setState({
      newReceipt: false,
      tableView: true
    });
  };

  render() {
    return (
      <div>
        <div className="switchButtons">
          {" "}
          <button className="add-button" onClick={this.handleTableView}>
            Receipt Table View
          </button>
          <button className="add-button" onClick={this.handleAddForm}>
            Add New Receipt
          </button>
        </div>
        <div>
          {this.state.newReceipt && (
            <ReceiptCapture handleTableView={this.handleTableView} />
          )}
        </div>{" "}
        <div>
          {this.state.tableView && (
            <div className="receipt-outer">
              <div className="table-style">
                <div className="head-row-style">
                  <div className="table-item">Receipt #</div>
                  <div className="table-item">Date</div>
                  <div className="table-item">Image</div>
                </div>
                {this.state.receipts.map(receipt => {
                  return (
                    <div className="row-style" key={receipt._id}>
                      <div className="table-item">{receipt._id}</div>
                      <div className="table-item">{receipt.shop_date}</div>
                      <div className="table-item">{receipt.filename}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>{" "}
      </div>
    );
  }
}

export default Receipts;
