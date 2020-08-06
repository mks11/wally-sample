import React, { Component } from "react";
import QrReader from "react-qr-reader";
import Paper from "@material-ui/core/Paper/Paper";
import LazyLoad from "react-lazyload";

import { isMobile } from "react-device-detect";

const desktopBrowserStyle = {
  content: {
    zindex: -1,
    position: "absolute",
    left: "50%",
    top: "20%",
    width: "40%",
    height: "40%",
    transform: "translate(-50%, -50%)",
  },
};

const mobileBrowserStyle = {
  mobile: {
    zindex: 1,
    position: "absolute",
    left: "50%",
    top: "35%",
    width: "60%",
    height: "60%",
    transform: "translate(-50%, -50%)",
  },
};

class QRCodeScanner extends Component {
  state = {
    result: "No result",
  };

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      paypal_email: "",
      busy: false,
      isPortrait: true,
    };
  }

  componentDidMount() {
    window.addEventListener("orientationchange", this.setScreenOrientation);
  }

  setScreenOrientation = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      this.setState({
        isPortrait: true,
      });
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
      this.setState({
        isPortrait: false,
      });
    }
  };

  handleScan = (data) => {
    if (data) {
      var domain = data.split("/");
      try {
        var packagingUnitId = domain[domain.length - 1];
      } catch (e) {
        console.log("link format error");
        this.setState({ result: "link format error" });
      }

      this.setState({
        result: "packaging Unit Id = " + packagingUnitId,
      });

      //callback to cartItemOrder with packagingUnitId
      this.props.makePatchAPICallLinkPackaging(packagingUnitId);

      //auto close QR popup after request is done
      this.props.onClose();
    }
  };
  handleError = (err) => {
    console.error(err);
  };

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    // alert("renter portrait ", this.state.isPortrait)

    return (
      <LazyLoad>
        <div className="error">
          <div className="backdrop">
            <LazyLoad>
              <Paper
                style={
                  isMobile
                    ? mobileBrowserStyle.mobile
                    : desktopBrowserStyle.content
                }
              >
                <button
                  className="error-modal-button"
                  onClick={this.props.onClose}
                >
                  X
                </button>

                <LazyLoad>
                  <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    props
                  />
                  <p>{this.state.result}</p>
                </LazyLoad>
              </Paper>
            </LazyLoad>
          </div>
        </div>
      </LazyLoad>
    );
  }
}

export default QRCodeScanner;
