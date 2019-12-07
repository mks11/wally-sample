import React, { Component } from 'react'
import {
  Modal,
  ModalBody,
  Container,
  Row,
  Col,
  Input
} from 'reactstrap'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'

import { connect } from 'utils'
import QrCodeScanner from './QRCodeScanner'

const DEFAULT_ERROR = 'Error: Calibrate Unit Weight'

class ModalSKUDetails extends Component {
  constructor(props) {
    super(props)

    this.adminStore = props.store.admin
    this.userStore = props.store.user
    this.modalStore = props.store.modal
    this.routing = props.store.routing

    this.state = {
      showError: false,
      errorMsg: DEFAULT_ERROR,
      product: props.product || {},
      unitWeight: props.product.unit_weight || '',
      editUnitWeight: false,
      isUpdating: false,

      isQROpen: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { product } = this.props

    if (!prevState.showModal) {
      if (product.id !== prevProps.product.id) {
        this.setState({
          product,
          showError: !product.unit_weight,
          unitWeight: product.unit_weight || '',
          editUnitWeight: !product.unit_weight,
          errorMsg: DEFAULT_ERROR,
        })
      } else {
        // for reopening the same product
        if (!product.unit_weight && !prevState.showError) {
          this.setState({ showError: true })
        }
      }
    }
  }

  handleOnUnitWeightChange = (e) => {
    this.setState({
      unitWeight: e.target.value
    })
  }

  handleSubmit = async () => {
    const {
      unitWeight,
      editUnitWeight,
      isUpdating,
      product,
    } = this.state

    if (!editUnitWeight) {
      this.setState({ editUnitWeight: true })
    } else {
      if (!isUpdating) {
        if (isNaN(unitWeight)) {
          this.setModalError('Unit weight is not a number')
        } else {
          this.setModalError('', false)
          this.setState({ isUpdating: true })

          this.adminStore.updateSKUUnitWeight({ unit_weight: unitWeight })
            .then(data => {
              this.setState({
                product: {
                  ...product,
                  ...data,
                },
                unitWeight: data.unit_weight,
              })
            })
            .catch(() => {
              this.modalStore.toggleModal('error')
            })
            .finally(() => {
              this.setState({
                isUpdating: false,
                editUnitWeight: false,
              })
            })
        }
      }
    }
  }

  setModalError = (errorMsg, display = true) => {
    this.setState({
      showError: display,
      errorMsg: errorMsg
    })
  }

  handlePrintLabel = () => {
    const { product } = this.state

    if (product.unit_weight) {
      this.routing.push(product.product_labels_url)
    } else {
      this.setModalError('Enter Unit Weight')
    }
  }

  handleScanQRCode = () => {
    const { product } = this.state

    if (product.unit_weight) {
      this.setState({ isQROpen: true })
    } else {
      this.setModalError('Enter Unit Weight')
    }
  }

  handleQRClose = packagingIds => {
    this.setState({ isQROpen: false })

    if (packagingIds.length) {
      this.adminStore.uploadCopackingQRCodes({ packagingIds })
    }
  }

  handleModalClose = () => {
    this.setState({ showError: false })
    this.props.toggleModal()
  }

  render() {
    const { showModal } = this.props

    const {
      showError,
      errorMsg,
      product,
      unitWeight,
      editUnitWeight,
      isQROpen,
    } = this.state

    return (
      <Modal isOpen={showModal} className="sku-modal">
        <ModalBody>
          <Container>
            <button className="btn-icon btn-icon--close" onClick={this.handleModalClose} />
            <h2 className="text-center text-error">{showError && errorMsg}</h2>
            <Table >
              <TableBody>
                <TableRow>
                  <TableCell align="left" className="sku-modal-first-col"><b>Product Name:</b></TableCell>
                  <TableCell align="left">{product.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left"><b>Unit Weight:</b></TableCell>
                  <TableCell align="left">
                    <Row noGutters>
                      <Col style={{ width: '50%' }}>
                        <Input
                          type="text"
                          name="selected"
                          invalid={!product.unit_weight}
                          value={unitWeight}
                          onChange={this.handleOnUnitWeightChange}
                          readOnly={!editUnitWeight}
                        />
                      </Col>
                      <Col className="pl-2" style={{ width: '50%' }}>
                        <button
                          type="button"
                          className="btn btn-sm active"
                          onClick={this.handleSubmit}
                        >
                          {editUnitWeight ? 'Submit' : 'Edit'}
                        </button>
                      </Col>
                    </Row>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left"><b>Estimated Quantity:</b></TableCell>
                  <TableCell align="left">50</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2}>
                    <Row>
                      <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                        <button
                          type="button"
                          className="btn btn-main active"
                          onClick={this.handlePrintLabel}
                        >
                          Print Product Labels
                        </button>
                      </Col>
                    </Row>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Row>
                      <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                        <button
                          type="button"
                          className="btn btn-main active"
                          onClick={this.handleScanQRCode}
                        >
                          Scan QR Code
                        </button>
                      </Col>
                    </Row>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left"><b>Actual Quantity:</b></TableCell>
                  <TableCell align="left">{product.actual_quantity || 'TBD'}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2}>
                    <Row>
                      <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                        {product.actual_quantity && product.unit_weight ? (
                          <a className="btn btn-main active" href={product.upc_case_labels_url}>Print UPC Code</a>
                        ) : (
                          <button className="btn btn-main" disabled>Print UPC Code</button>
                        )}

                      </Col>
                    </Row>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left" colSpan={2}><b>Outbound Shipments:</b></TableCell>
                </TableRow>
                {product.outbound_shipments && product.outbound_shipments.map(s => (
                  <TableRow key={s.id}>
                    <TableCell align="left">{`  Shipment ${s.id}:`}</TableCell>
                    <TableCell align="left">{(product.case_quantity / product.jar_quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </Container>
          <QrCodeScanner
            isOpen={isQROpen}
            onClose={this.handleQRClose}
          />
        </ModalBody>
      </Modal>
    )
  }

}

export default connect("store")(ModalSKUDetails)
