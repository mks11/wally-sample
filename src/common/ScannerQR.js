import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import LazyLoad from 'react-lazyload'
import { isMobile } from 'react-device-detect'
import { Paper, Snackbar, SnackbarContent } from '@material-ui/core'

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
}

const REGEX_MATCH = /https:\/\/thewallyshop\.co\/packaging\/(.*)/

class ScannerQR extends Component {
  constructor(props) {
    super(props)

    this.state = {
      packagingIds: [],
      isPortrait: true,
      isError: false,
      snackBarOpen: false,
      snackBarText: '',
    }
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.setScreenOrientation)
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.setScreenOrientation)
  }

  setScreenOrientation = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.setState({ isPortrait: false })
    }

    if (window.matchMedia('(orientation: landscape)').matches) {
      this.setState({ isPortrait: true })
    }
  }

  handleScan = scannedData => {
    if (scannedData) {
      const matchedData = scannedData.match(REGEX_MATCH)
      const packagingId = matchedData && matchedData[1]

      if (matchedData && packagingId) {
        const { packagingIds } = this.state

        if (window.navigator.vibrate) {
          window.navigator.vibrate(500)
        }

        if (!packagingIds.includes(packagingId)) {
          this.setState({
            snackBarText: 'QR Scanned',
            snackBarOpen: true,
            isError: false,
            packagingIds,
          })

          packagingIds.push(packagingId)
        } else {
          this.setState({
            snackBarText: 'QR Already Scanned',
            snackBarOpen: true,
            isError: true,
            packagingIds,
          })
        }
      }
    }
  }

  handleError = err => {
    const { onError } = this.props;
    onError && onError(err);
  }

  handleCloseModal = () => {
    const { onClose } = this.props
    const { packagingIds } = this.state
    onClose(packagingIds)
  }

  handleToggleSnackbar = () => {
    this.setState({ snackBarOpen: !this.state.snackBarOpen })
  }

  render() {
    const {
      isPortrait,
      isError,
      snackBarOpen,
      snackBarText,
      } = this.state
    const { isOpen } = this.props

    if (!isOpen) {
      return null
    }

    return (
      <div className="qr-modal">
        <div className='backdrop qr-modal-backdrop'>
          <Paper
            style={
              isMobile
                ? (isPortrait ? styles.mobile : styles.mobileLandscape)
                : styles.desktop
            }
          >
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
            </LazyLoad>
          </Paper>

          <Snackbar
            autoHideDuration={1000}
            onClose={this.handleToggleSnackbar}
            open={snackBarOpen}
          >
            <SnackbarContent
              style={{
                backgroundColor: isError ? '#ffa000' : '#43a047'
              }}
              message={snackBarText}
            />
          </Snackbar>
        </div>
      </div>
    )
  }
}


export default ScannerQR
