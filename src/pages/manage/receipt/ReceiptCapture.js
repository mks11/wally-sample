import React, { Component } from "react";
import { connect } from "../../../utils";
import moment from "moment";
import { Container, Col, Row, Button, Input } from "reactstrap";
import CustomDropdown from "../../../common/CustomDropdown";

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::: ReceiptCapture CLASS ::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
class ReceiptCapture extends Component {
  constructor(props) {
    super(props)

    this.locations = props.locations;
    this.adminStore = props.adminStore;
    this.modalStore = props.modalStore;

    this.state = {
      location: null,
      image: null,
      file: '',
      msgPopUp: false,
      message: ''
    };
  }

  submitForm = () => {
    const { location, image, file } = this.state
    // If location & image are chosen by User...
    if (location != null && image != null) {
      let res = this.adminStore.uploadReceipt(
        moment().format("YYYY-MM-DD"),
        file,
        location
      );
      if (res) {
        this.setState({
          msgPopUp: true,
          message: "Successfully Added"
        });

        setTimeout(this.removePopUp, 1000);
      }
    } else {
      // Display Error Pop if Location or image isn't chosen by user
      this.modalStore.toggleModal('error', 'Please Select Location & an Image.')
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
    this.setState({ location: location });
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
    const { image, message, msgPopUp } = this.state

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
                {image === null && !msgPopUp && (
                  <Input
                    type="file"
                    onChange={this.onImageAdd}
                    style={{ textAlign: "center", width: "70%" }}
                    className="form-control center"
                  />
                )}
                {image !== null && !msgPopUp && (
                  <div className="img-preview">
                    <img
                      className="temp-img"
                      src={image}
                      alt="curr"
                    />
                    <button onClick={this.clearImg}>Clear Image</button>
                  </div>
                )}
                {/* Message popUp */}
                {msgPopUp && (
                  <div className="msg-pop-up">
                    <div>{message}</div>
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
                { id: 'all', title: 'Locations' },
                ...this.locations.map(location => ({ id: location, title: location })),
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

export default connect("store")(ReceiptCapture);
