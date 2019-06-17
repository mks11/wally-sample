import React, { Component } from "react";
import "./ReceiptCapture.css";
import S3FileUpload from "react-s3";
const axios = require("axios");

const config = {
  bucketName: "daily-receipts",
  dirName:
    "https://the-wally-shop-app.s3.us-east-2.amazonaws.com/daily-receipts/" /* optional */,
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

class ReceiptCapture extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      locations: [],
      locationView: false,
      chosenLocation: "",
      dateTime: "",
      image: ""
    };
    this.handleTableView = this.props.handleTableView;
  }

  componentDidMount() {
    axios
      .get("http://localhost:4001/api/admin/shopping/locations")
      .then(response => {
        //console.log(response.data.locations);
        this.setState({
          locations: response.data.locations
        });
      })
      .catch(error => {
        console.log(error);
      });

    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    var ddmmyyyy = pad(month + 1) + "-" + pad(date) + "-" + year;
    this.setState({ dateTime: ddmmyyyy });
  }

  locationPicker = () => {
    this.setState({ locationView: !this.state.locationView });
  };

  submitForm = () => {
    console.log("submitForm clicked");

    S3FileUpload.uploadFile(this.state.image, config).then(data =>
      console.log(data)
    );
    axios
      .post("http://localhost:4001/api/admin/shopping/receipt", {
        shop_date: this.state.dateTime,
        filename: "test6",
        location: this.state.chosenLocation
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  onImageAdd = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  clearImg = () => {
    this.setState({ image: "" });
  };

  setLocation = location => {
    console.log(location);
    this.setState({ chosenLocation: location, locationView: false });
  };

  render() {
    return (
      <div className="outer-rec-cap">
        <div className="upload-form-outer">
          <div className="upload-title">Upload Receipt</div>
          <div className="photo-viewer">
            {this.state.image === "" && (
              <input type="file" onChange={this.onImageAdd} />
            )}
            {this.state.image !== "" && (
              <div className="img-preview">
                <img className="temp-img" src={this.state.image} alt="curr" />
                <button onClick={this.clearImg}>Clear Image</button>
              </div>
            )}{" "}
          </div>

          {/* Outer Form Selection View */}
          {!this.state.locationView && (
            <div className="form-section">
              <div className="location-dropdown">
                {" "}
                <button className="location-btn" onClick={this.locationPicker}>
                  {this.state.chosenLocation === "" && "Location"}
                  {this.state.chosenLocation !== "" &&
                    this.state.chosenLocation}
                </button>
              </div>

              <div className="receipt-submit">
                <button className="submit-btn" onClick={this.submitForm}>
                  Submit
                </button>
              </div>
            </div>
          )}
          {/* Location Selection View */}
          {this.state.locationView &&
            this.state.locations.map(location => {
              return (
                <div
                  key={location}
                  className="form-section"
                  onClick={() => this.setLocation(location)}
                >
                  {location}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default ReceiptCapture;
