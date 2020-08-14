import React, { Component } from 'react'
import {
  Row,
  Col,
  Input,
} from 'reactstrap'

import { connect } from 'utils'

import ScannerBarcode from 'common/ScannerBarcode'

class ScanUPCFooter extends Component {
  constructor(props) {
    super(props)

    this.adminStore = props.store.admin
    this.modalStore = props.store.modal

    this.state = {
      isBarScanOpen: false,
      userBarcodeValue: '',
    }
  }

  toggleBarScan = () => {
    this.setState({ isBarScanOpen: !this.state.isBarScanOpen })
  }

  handleUserBarcodeChange = e => {
    this.setState({ userBarcodeValue: e.target.value })
  }

  handleSubmitUserBarcode = () => {
    if (this.state.userBarcodeValue.length) {
      this.getCodeInfo(this.state.userBarcodeValue)
    }
  }

  handleEnter = e => {
    if (e.keyCode === 13) {
      this.handleSubmitUserBarcode()
    }
  }

  handleDetectedValue = code => {
    this.getCodeInfo(code)
  }

  getCodeInfo = code => {
    const { onUPCGet } = this.props

    this.adminStore.getUPCInfo(code)
      .then(res => {
        onUPCGet && onUPCGet(res)
      })
      .catch(error => {
        if (error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) {
          this.modalStore.toggleModal('error', error.response.data.error.message)
        } else {
          this.modalStore.toggleModal('error', 'Wasn\'t able to get UPC info')
        }
      })
  }

  render() {
    const {
      isBarScanOpen,
      userBarcodeValue,
    } = this.state

    return (
      <>
        <Row>
          <Col className="p-4 text-center" sm={{ size: 6 }} md={{ size: 6 }}>
            <button className="btn btn-main active" onClick={this.toggleBarScan}>Scan Inbound UPC</button>
          </Col>
          <Col className="p-4 text-center" sm={{ size: 6 }} md={{ size: 6 }}>
            <Row>
              <Col>
                <Input
                  type="text"
                  value={userBarcodeValue}
                  onKeyDown={this.handleEnter}
                  onChange={this.handleUserBarcodeChange}
                  placeholder="Enter UPC"
                  style={{ height: '100%' }}
                />
              </Col>
              <Col>
                <button className="btn btn-main active" onClick={this.handleSubmitUserBarcode}>Submit</button>
              </Col>
            </Row>
          </Col>
        </Row>

        <ScannerBarcode
          isOpen={isBarScanOpen}
          onClose={this.toggleBarScan}
          onDetect={this.handleDetectedValue}
          messageSuccess="Barcode Scanned"
          messageError="Barcode Scan Error"
          closeOnScan
        />
      </>
    )
  }
}

export default connect("store")(ScanUPCFooter)
