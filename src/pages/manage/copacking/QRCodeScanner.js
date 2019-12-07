import React, { Component } from 'react';
import QrReader from 'react-qr-reader'
import LazyLoad from 'react-lazyload';
import { isMobile } from 'react-device-detect';
import { Paper } from '@material-ui/core';

const styles = {
  desktop: {
    zindex: -1,
    position: 'absolute', left: '50%', top: '40%',
    width: '40vw',
    height: '40vw',
    transform: 'translate(-50%, -50%)'
  },
  mobile: {
    zindex: 1,
    position: 'absolute',
    left: '50%', top: '40%',
    width: '80vw',
    height: '80vw',
    transform: 'translate(-50%, -50%)'
  },
  mobileLandscape: {
    zindex: 1,
    position: 'absolute',
    left: '50%', top: '25%',
    width: '40vw',
    height: '40vw',
    transform: 'translate(-50%, -50%)'
  }
};

const REGEX_MATCH = /https:\/\/thewallyshop\.co\/packaging\/(.*)/

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packagingIds: [],
      isPortrait: true,
      result: '',
      isError: false,
    };
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.setScreenOrientation)
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.setScreenOrientation)
  }

  setScreenOrientation = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.setState({ isPortrait: false });
    }

    if (window.matchMedia('(orientation: landscape)').matches) {
      this.setState({ isPortrait: true });
    }
  };

  handleScan = scannedData => {
    if (scannedData) {
      const matchedData = scannedData.match(REGEX_MATCH)
      const packagingId = matchedData && matchedData[1]

      if (matchedData && packagingId) {
        const { packagingIds } = this.state

        if (!packagingIds.includes(packagingId)) {
          packagingIds.push(packagingId)
        }

        this.setState({
          result: 'The link was scanned!',
          isError: false,
          packagingIds,
        });

      } else {
        this.setState({
          result: 'Wrong link format!',
          isError: true,
        });
      }
    }
  };

  handleError = err => { /* console.error(err) */ };

  handleCloseModal = () => {
    const { onClose } = this.props
    const { packagingIds } = this.state
    onClose(packagingIds)
  }

  render() {
    const { isPortrait, result, isError } = this.state
    const { isOpen } = this.props

    if (!isOpen) {
      return null;
    }

    return (
      <div className="qr-modal">
        <div className='backdrop qr-modal-backdrop'>
            <Paper style={isMobile ? (isPortrait ? styles.mobile : styles.mobileLandscape) : styles.desktop}>
              <div className="qr-modal-control">
                <button className="btn-icon btn-icon--close" onClick={this.handleCloseModal} />
              </div>
              <LazyLoad>
                <QrReader
                  delay={300}
                  onError={this.handleError}
                  onScan={this.handleScan}
                  props
                />
                <p className={`text-center qr-modal-result p-2 ${isError ? 'text-error' : 'text-success'}`}>{result}</p>
              </LazyLoad>
            </Paper>
        </div>
      </div>
    )
  }
}


export default QRCodeScanner;
