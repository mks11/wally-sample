import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QrReader from 'react-qr-reader';
import LazyLoad from 'react-lazyload';
import {
  Container,
  Grid,
  Paper,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import styled from 'styled-components';

const REGEX_MATCH = /https:\/\/thewallyshop\.co\/packaging\/(.*)/;

const ScannerBackdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
`;

const ScannerContainer = styled(Grid)`
  height: 100%;
`;

const Scanner = styled(Paper)`
  @media only screen and (max-width: 767px) {
    z-index: 1;
    position: relative;
    width: 80vw;
    height: 80vw;
  }

  @media only screen and (orientation: 'landscape') {
    z-index: 1;
    position: relative;
    width: 40vw;
    height: 40vw;
  }

  @media only screen and (min-width: 768px) {
    z-index: -1;
    width: 40vw;
    height: 40vw;
  }
`;

class ScannerQR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packagingId: '',
      packagingIds: [],
      isPortrait: true,
      isError: false,
      snackBarOpen: false,
    };
  }

  componentDidMount() {
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

  handleScan = (scannedData) => {
    if (scannedData) {
      const matchedData = scannedData.match(REGEX_MATCH);
      const packagingId = matchedData && matchedData[1];

      if (matchedData && packagingId) {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(500);
        }

        if (this.props.multiple) {
          // scan multiple values
          const { packagingIds } = this.state;

          if (!packagingIds.includes(packagingId)) {
            // TODO This is the original QR Scanning code, but Mukul pointed out the incorrect use of state here.
            // TODO Remove on confirmation the new code works.
            // this.setState({
            //   snackBarOpen: true,
            //   isError: false,
            //   packagingIds,
            // })

            // packagingIds.push(packagingId)
            this.setState(({ packagingIds }) => ({
              snackBarOpen: true,
              isError: false,
              packagingIds: [...packagingIds, packagingId],
            }));
          } else {
            this.setState({
              snackBarOpen: true,
              isError: true,
              packagingIds,
            });
          }
        } else {
          // scan sinlge value
          this.setState({
            snackBarOpen: true,
            isError: false,
            packagingId,
          });
        }
      }
    }
  };

  handleError = (err) => {
    const { onError } = this.props;
    onError && onError(err);
  };

  handleCloseModal = () => {
    const { onClose, multiple, dataId } = this.props;
    const { packagingId, packagingIds } = this.state;

    if (multiple) {
      onClose(packagingIds, dataId);
    } else {
      onClose(packagingId, dataId);
    }
  };

  handleToggleSnackbar = () => {
    this.setState((prev) => ({ snackBarOpen: !prev.snackBarOpen }));
  };

  render() {
    const { isPortrait, isError, snackBarOpen } = this.state;
    const {
      isOpen,
      messageSuccess = 'Scan Success',
      messageError = 'Scan Error',
    } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Container maxWidth="md">
        <ScannerBackdrop>
          <ScannerContainer container justify="center" alignItems="center">
            <Grid item>
              <Scanner>
                <div className="qr-modal-control">
                  <button
                    className="btn-icon btn-icon--close"
                    onClick={this.handleCloseModal}
                  />
                </div>
                <LazyLoad>
                  <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    props
                  />
                </LazyLoad>
              </Scanner>
            </Grid>
          </ScannerContainer>

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
        </ScannerBackdrop>
      </Container>
    );
  }
}

ScannerQR.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ScannerQR;
