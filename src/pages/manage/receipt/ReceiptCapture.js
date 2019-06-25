import React, { Component } from "react";
import "./ReceiptCapture.css";
import S3 from "aws-s3";
import moment from "moment";
import { Container, Col, Row, Button, Input } from "reactstrap";

import CustomDropdown from "../../../common/CustomDropdown";
const axios = require("axios");

// S3 Configuration
const config = {
  bucketName: "the-wally-shop-app",
  dirName: `daily-receipts/${moment().format("YYYY[-]MM[-]DD")}`,
  region: "us-east-2",
  accessKeyId: "AKIAJVL4SVXQNCJJWRMA",
  secretAccessKey: "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"
};
const S3Client = new S3(config);

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::: ReceiptCapture CLASS ::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
class ReceiptCapture extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      locations: [],
      location: null,
      image: null,
      file: "",
      msgPopUp: false,
      message: ""
    };
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
  }

  submitForm = () => {
    // If location & image are chosen by User...
    if (this.state.location != null && this.state.image != null) {
      // Upload File to S3
      S3Client.uploadFile(this.state.file)
        .then(data =>
          // If Upload to S3 Successful push to backend
          axios
            .post("http://localhost:4001/api/admin/shopping/receipt", {
              shop_date: moment().format("YYYY-MM-DD"),
              filename: data.key
                .split("/")
                .slice(-1)
                .join("/"),
              location: this.state.location
            })
            .then(response => {
              this.setState({
                location: null,
                image: null,
                file: "",
                msgPopUp: true,
                message: "Successfully Added"
              });
              console.log(response.data);
              setTimeout(this.removePopUp, 1000);
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
      setTimeout(this.removePopUp, 1000);
    }
  };

  // Remove PopUp Error or Success Message Function
  removePopUp = () => {
    this.setState({ msgPopUp: false, message: "" });
    this.props.handleTableView();
  };

  // setLocation sets the chosen Location to state
  setLocation = location => {
    this.setState({ location });
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
    this.setState({ image: null, file: "" });
  };

  render() {
    return (
      <React.Fragment>
        <Col md="12" sm="12">
          <h2 align="center">Upload Receipt</h2>
          <Row align="center">
            <Container md="12" sm="12" align="center">
              <Row
                className="row align-items-center justify-content-center"
                style={{ height: "500px", background: "black" }}
                align="center"
              >
                {this.state.image === null && !this.state.msgPopUp && (
                  <Input
                    type="file"
                    onChange={this.onImageAdd}
                    style={{ textAlign: "center", width: "70%" }}
                    className="form-control center"
                  />
                )}
                {this.state.image !== null && !this.state.msgPopUp && (
                  <div className="img-preview">
                    <img
                      className="temp-img"
                      src={this.state.image}
                      alt="curr"
                    />
                    <button onClick={this.clearImg}>Clear Image</button>
                  </div>
                )}
                {/* Message popUp */}
                {this.state.msgPopUp && (
                  <div className="msg-pop-up">
                    <div>{this.state.message}</div>
                  </div>
                )}
              </Row>
            </Container>
          </Row>
          <Row
            className="row align-items-center justify-content-center"
            align="center"
            style={{ height: "80px" }}
          >
            <CustomDropdown
              values={[
                { id: "all", title: "Locations" },
                ...this.state.locations.map(location => {
                  return { id: location, title: location };
                })
              ]}
              onItemClick={this.setLocation}
            />
            <Button onClick={this.submitForm}>Submit</Button>
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

export default ReceiptCapture;
