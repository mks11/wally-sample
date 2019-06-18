import React, { Component } from "react";
import "./ReceiptCapture.css";
import S3 from "aws-s3";
const axios = require("axios");

// S3 Configuration
const config = {
  bucketName: "the-wally-shop-app",
  dirName: `daily-receipts/${currentDate()}`,
  region: "us-east-2",
  accessKeyId: "AKIAJVL4SVXQNCJJWRMA",
  secretAccessKey: "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"
};
const S3Client = new S3(config);

// Current Date Getter - YYYY-MM-DD
function currentDate() {
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  var yyyymmdd = year + "-" + pad(month + 1) + "-" + pad(date);
  return yyyymmdd;
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::: ReceiptCapture CLASS ::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
class ReceiptCapture extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      locations: [],
      locationView: false,
      chosenLocation: "",
      dateTime: "",
      image: "",
      file: "",
      msgPopUp: false,
      message: ""
    };
    this.handleTableView = this.props.handleTableView;
  }

  // When Component Mounts get list of locations
  componentDidMount() {
    axios
      .get("http://localhost:4001/api/admin/shopping/locations")
      .then(response => {
        this.setState({
          locations: response.data.locations
        });
      })
      .catch(error => {
        console.log(error);
      });
    // Also set date
    let date = currentDate() + " 2:00PM-8:00PM";
    this.setState({ dateTime: date });
  }

  submitForm = () => {
    // If location & image are chosen by User...
    if (this.state.location != "" && this.state.image != "") {
      // Upload File to S3
      S3Client.uploadFile(this.state.file)
        .then(data =>
          // If Upload to S3 Successful push to backend
          axios
            .post("http://localhost:4001/api/admin/shopping/receipt", {
              shop_date: this.state.dateTime,
              filename: data.key
                .split("/")
                .slice(-1)
                .join("/"),
              location: this.state.chosenLocation
            })
            .then(response => {
              this.setState({
                chosenLocation: "",
                image: "",
                file: "",
                msgPopUp: true,
                message: "Successfully Added"
              });
              console.log(response.data);
              setTimeout(this.removePopUp, 2000);
            })
            .catch(error => {
              console.log(error);
            })
        )
        .catch(err => console.error(err));
    } else {
      // Display Error Pop if Location or image isn't chosen by user
      this.setState({
        msgPopUp: true,
        message: "Error. Please Select Location & an Image."
      });
      setTimeout(this.removePopUp, 2000);
    }
  };

  // Remove PopUp Error or Success Message Function
  removePopUp = () => {
    this.setState({ msgPopUp: false, message: "" });
  };

  // location dropDown Menu Open/Close Function
  locationPicker = () => {
    this.setState({ locationView: !this.state.locationView });
  };
  // setLocation sets the chosen Location to state
  setLocation = location => {
    this.setState({ chosenLocation: location, locationView: false });
  };

  // When Image is selected from file system...
  onImageAdd = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      // add version of image for pre-submit view
      reader.onload = e => {
        this.setState({ image: e.target.result });
      };
      // And Put file itself in state for uploading to S3
      reader.readAsDataURL(event.target.files[0]);
      this.setState({ file: event.target.files[0] });
    }
  };

  // If User choses to clear image, clear image & file state
  clearImg = () => {
    this.setState({ image: "", file: "" });
  };

  render() {
    return (
      <div className="outer-rec-cap">
        {/* Message popUp */}
        {this.state.msgPopUp && (
          <div className="msg-pop-up">
            <div>{this.state.message}</div>
          </div>
        )}
        <div className="upload-form-outer">
          <div className="upload-title">Upload Receipt</div>
          <div className="photo-viewer">
            {this.state.image === "" && (
              <input type="file" onChange={this.onImageAdd} />
            )}
            {this.state.image !== "" && (
              <div className="img-preview">
                <img className="temp-img" src={this.state.image} alt="curr" />
                <button className="clear-img-btn" onClick={this.clearImg}>
                  Clear Image
                </button>
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
