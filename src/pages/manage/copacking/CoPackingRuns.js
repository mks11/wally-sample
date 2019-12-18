import React, { Component } from 'react'
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Container,
  Input,
} from 'reactstrap'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import Title from 'common/page/Title'
import { connect } from 'utils'

import BarcodeScanner from './BarcodeScanner'

class ManageCoPackingRuns extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.routing = props.store.routing
    this.modalStore = props.store.modal

    this.state = {
      copackingruns: [],
      isBarScanOpen: false,
      isBarResultOpen: false,
      userBarcodeValue: '',

      name: '',
      copacking_process: '',
      product_id: '',
      sku_id: '',
    }
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || !['admin', 'co-packer'].includes(user.type)) {
          this.props.store.routing.push('/')
        } else {
          this.loadCoPackingRunsData()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadCoPackingRunsData = () => {
    this.adminStore.getCopackingRuns()
      .then(data => {
        this.setState({ copackingruns: data })
      })
      .catch(error => {
        this.modalStore.toggleModal('error', 'Can\'t get co-packing runs')
      })
  }

  handleRowClick = id => {
    this.routing.push(`/manage/co-packing/runs/${id}`)
  }

  toggleBarScan = () => {
    this.setState({ isBarScanOpen: !this.state.isBarScanOpen })
  }

  toggleBarResult = () => {
    if (this.state.isBarResultOpen) {
      this.setState({
        isBarResultOpen: false,
        name: '',
        copacking_process: '',
        product_id: '',
        sku_id: '',
      })
    } else {
      this.setState({
        isBarResultOpen: true,
      })
    }
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
    this.adminStore.getUPCInfo(code)
      .then(res => {
        this.setState({
          name: res.name,
          copacking_process: res.copacking_process,
          product_id: res.product_id,
          sku_id: res.sku_id,
        })
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
      copackingruns,
      isBarScanOpen,
      isBarResultOpen,
      userBarcodeValue,

      name,
      copacking_process,
    } = this.state

    return (
      <div className="App co-packing-page">
        <Title content="Co-Packing Runs" />
        <Container>
          <Paper elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ width: '60%' }}>Co-Packing Process</TableCell>
                  <TableCell># SKUs</TableCell>
                  <TableCell>Est. # Jars</TableCell>
                  <TableCell>Est. Time (mins)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {copackingruns.map(run => (
                  <TableRow
                    key={run._id}
                    className="clickable-row"
                    onClick={() => this.handleRowClick(run._id)}
                  >
                    <TableCell align="left">{run.copacking_process}</TableCell>
                    <TableCell>{run.products.length}</TableCell>
                    <TableCell>{run.estimated_units}</TableCell>
                    <TableCell>{Math.round(run.estimated_time / 60)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
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
        </Container>

        <BarcodeScanner
          isOpen={isBarScanOpen}
          onClose={this.toggleBarScan}
          onDetect={this.handleDetectedValue}
        />

        <Modal
          autoFocus={false}
          isOpen={isBarResultOpen}
          centered
        >
          <ModalBody>
            <button className="btn-icon btn-icon--close" onClick={this.toggleBarResult}></button>
            <div className="login-wrap">
              <p className="info-popup">
                {`Product Name: ${name}`}
              </p>
              <p className="info-popup">
                {`Co-packing Process: ${copacking_process}`}
              </p>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRuns)
