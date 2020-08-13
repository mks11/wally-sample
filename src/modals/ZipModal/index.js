import React, { Component } from "react";
import { Input } from "reactstrap";
import { logEvent } from "services/google-analytics";

class ZipModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipValue: "",
    };
  }

  componentDidMount() {
    const { zip } = this.props.stores;
    zip.loadZipCodes().catch((e) => {
      console.error("Failed to load zipcodes: ", e);
    });
  }

  handleSubmit = (e) => {
    const { zipValue } = this.state;
    if (!zipValue) return;

    const { zip } = this.props.stores;

    zip.selectedZip = zipValue;
    logEvent({ category: "Signup", action: "SubmitZip", label: zipValue });
    if (zip.validateZipCode(zipValue)) {
      zip.setZip(zipValue);
      this.props.switchTo("signup");
    } else {
      this.props.switchTo("invalidzip");
    }
    e.preventDefault();
  };

  handleZipEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  onInputChange = (e) => {
    this.setState({ zipValue: e.target.value });
  };

  render() {
    const { zipValue } = this.state;

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">What's your zipcode?</h3>
        <span className="mb-5">
          The Wally Shop is only available in select zipcodes.
        </span>
        <Input
          className="aw-input--control aw-input--center mb-5"
          type="number"
          placeholder="Enter your zipcode"
          onKeyDown={this.handleZipEnter}
          onChange={this.onInputChange}
        />
        <button
          type="button"
          className={`btn btn-main ${zipValue ? "active" : ""}`}
          onClick={this.handleSubmit}
        >
          SUBMIT
        </button>
      </div>
    );
  }
}

export default ZipModal;
