import React, { Component } from 'react'
import Quagga from 'quagga'
import { isMobile } from 'react-device-detect'
import { Paper } from '@material-ui/core'

const styles = {
  desktop: {
    zindex: -1,
    position: 'absolute', left: '50%', top: '40%',
    transform: 'translate(-50%, -50%)'
  },
  mobile: {
    zindex: 1,
    position: 'absolute',
    left: '0', top: '50%',
    transform: 'translateY(-50%)'
  },
  mobileLandscape: {
    zindex: 1,
    position: 'absolute',
    left: '50%', top: '0',
    transform: 'translateX(-50%)'
  }
}

class BarcodeScanner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      packagingIds: [],
      isPortrait: true,
      result: '',
      isError: false,
      width: 200,
      height: 200,
    }
  }

  componentDidMount() {
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    if (innerWidth > innerHeight) {
      // landscape
      this.setState({
        width: Math.round(innerWidth / 2),
        height: Math.round(innerHeight),
      })
    } else {
      this.setState({
        width: Math.round(innerWidth),
        height: Math.round(innerHeight / 2),
      })
    }

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


  componentDidUpdate(prevProps) {
    const { width, height } = this.state

    if(this.props.isOpen !== prevProps.isOpen) {
      if (this.props.isOpen) {
        Quagga.init({
          inputStream: {
            type : 'LiveStream',
            constraints: {
              width,
              height,
              facingMode: 'environment'
            }
          },
          locator: {
            patchSize: 'medium',
            halfSample: true
          },
          numOfWorkers: 2,
          decoder: {
            readers : [
              'upc_reader',
            ],
          },
          locate: true,
        }, function(err) {
          if (err) {
            return console.warn(err)
          }
          Quagga.start()
        })
        Quagga.onDetected(this.onScanDetect)
      } else {
        Quagga.offDetected(this.onScanDetect)
      }
    }
  }

  onScanDetect = result => {
    this.props.onDetect(result.codeResult.code)
    this.props.onClose()
  }

  render() {
    const { isPortrait, result, isError, width, height } = this.state
    const { isOpen, onClose } = this.props

    if (!isOpen) {
      return null
    }

    const paperStyle = isMobile ? (isPortrait ? styles.mobile : styles.mobileLandscape) : styles.desktop

    return (
      <div className="qr-modal">
        <div className='backdrop qr-modal-backdrop'>
          <Paper style={{ ...paperStyle, width, height }}>
            <button className="btn-icon btn-icon--close" onClick={onClose} />
            <div id="interactive" className="viewport"/>
            <p className={`text-center qr-modal-result p-2 ${isError ? 'text-error' : 'text-success'}`}>{result}</p>
          </Paper>
        </div>
      </div>
    )
  }
}


export default BarcodeScanner
