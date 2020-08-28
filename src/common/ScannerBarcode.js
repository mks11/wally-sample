import React, { Component } from 'react';
import Quagga from 'quagga';
import { isMobile } from 'react-device-detect';
import { Paper, Snackbar, SnackbarContent } from '@material-ui/core';

const styles = {
  desktop: {
    zindex: -1,
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
  },
  mobile: {
    zindex: 1,
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  mobileLandscape: {
    zindex: 1,
    position: 'absolute',
    left: '50%',
    top: '0',
    transform: 'translateX(-50%)',
  },
};

function getQuaggaSettings({ width, height }) {
  return {
    inputStream: {
      type: 'LiveStream',
      constraints: {
        width,
        height,
        facingMode: 'environment',
      },
    },
    locator: {
      patchSize: 'medium',
      halfSample: true,
    },
    numOfWorkers: 2,
    decoder: {
      readers: ['upc_reader'], // we're interested only in UPC barcode type
    },
    locate: true,
  };
}

class ScannerBarcode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPortrait: true,
      isError: false,
      snackBarOpen: false,
      width: 200,
      height: 200,
    };
  }

  componentDidMount() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    if (innerWidth > innerHeight) {
      // landscape
      this.setState({
        width: Math.round(innerWidth / 2),
        height: Math.round(innerHeight),
      });
    } else {
      // portrait
      this.setState({
        width: Math.round(innerWidth),
        height: Math.round(innerHeight / 2),
      });
    }

    window.addEventListener('orientationchange', this.setScreenOrientation);
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.setScreenOrientation);
  }

  setScreenOrientation = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.setState({ isPortrait: false });
    }

    if (window.matchMedia('(orientation: landscape)').matches) {
      this.setState({ isPortrait: true });
    }
  };

  componentDidUpdate(prevProps) {
    const { width, height } = this.state;

    if (this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        Quagga.init(getQuaggaSettings({ width, height }), (err) => {
          if (err) {
            this.setState({
              snackBarOpen: true,
              isError: true,
            });

            console.log(err);

            return;
          }
          Quagga.start();
        });
        Quagga.onDetected(this.onScanDetect);
      } else {
        Quagga.offDetected(this.onScanDetect);
      }
    }
  }

  onScanDetect = (result) => {
    const { onDetect, onClose, closeOnScan, dataId } = this.props;

    onDetect(result.codeResult.code, dataId);
    this.setState({ snackBarOpen: true });

    if (closeOnScan) {
      onClose && onClose();
    }
  };

  handleToggleSnackbar = () => {
    const { onClose, closeOnScan } = this.props;

    this.setState({ snackBarOpen: !this.state.snackBarOpen });

    if (!closeOnScan) {
      onClose && onClose();
    }
  };

  render() {
    const { isPortrait, isError, width, height, snackBarOpen } = this.state;
    const {
      isOpen,
      onClose,
      messageSuccess = 'Scan Success',
      messageError = 'Scan Error',
    } = this.props;

    if (!isOpen) {
      return null;
    }

    const paperStyle = isMobile
      ? isPortrait
        ? styles.mobile
        : styles.mobileLandscape
      : styles.desktop;

    return (
      <div className="qr-modal">
        <div className="backdrop qr-modal-backdrop">
          <Paper style={{ ...paperStyle, width, height }}>
            <button className="btn-icon btn-icon--close" onClick={onClose} />
            {/* default id and class for quagga #interactive.viewport */}
            <div id="interactive" className="viewport" />
          </Paper>

          <Snackbar
            autoHideDuration={1000}
            onClose={this.handleToggleSnackbar}
            open={snackBarOpen}
          >
            <SnackbarContent
              style={{
                backgroundColor: isError ? '#ffa000' : '#43a047',
              }}
              message={isError ? messageError : messageSuccess}
            />
          </Snackbar>
        </div>
      </div>
    );
  }
}

export default ScannerBarcode;
