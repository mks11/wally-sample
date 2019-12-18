import React, { Component } from 'react'
import {
  Row,
  Col,
  Container,
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
import ModalSKUDetails from './ModalSKUDetails'

class ManageCoPackingRunsSpecific extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.contentStore = props.store.content
    this.modalStore = props.store.modal

    this.state = {
      copackingrun: null,
      skuModal: false,
      selectedProduct: {},
      selectedCopackingRun: null,
    }
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || !['admin', 'co-packer'].includes(user.type)) {
          this.props.store.routing.push('/')
        } else {
          this.loadCoPackingRunsProducts()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadCoPackingRunsProducts() {
    const runId = this.props.match.params.runId

    this.adminStore.getCopackingRunProducts(runId)
      .then(data => {
        this.setState({ copackingrun: data })
      })
      .catch(error => {
        this.modalStore.toggleModal('error', 'Can\'t get co-packing runs products')
      })
  }

  toggleModal = () => {
    this.setState({ skuModal: !this.state.skuModal })
  }

  openProductSKUDetails = productId => {
    const { copackingrun } = this.state

    if (copackingrun && copackingrun.products) {
      this.setState({
        selectedProduct: copackingrun.products.find(p => p.product_id === productId) || {},
        selectedCopackingRun: copackingrun._id,
      }, () => {
        this.toggleModal()
      })
    }
  }

  handlePrintEmail = () => {
    this.adminStore.getPrintEmail(this.state.copackingrun.print_url)
      .then(res => {
        console.log(res);
      });
  };

  render() {
    const {
      skuModal,
      copackingrun,
      selectedProduct,
      selectedCopackingRun,
    } = this.state

    return (
      <div className="App co-packing-page">
        <Title content={copackingrun && copackingrun.copacking_process} />
        <Container>
          <Paper elevation={1} className="scrollable-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Product Name</TableCell>
                  <TableCell>Packaging Type</TableCell>
                  <TableCell># Packaging (Cases)</TableCell>
                  <TableCell>Est. Units</TableCell>
                  <TableCell>Est. Time (mins)</TableCell>
                  <TableCell>Volume (lbs)</TableCell>
                  <TableCell>Tracking #</TableCell>
                  <TableCell>Shipment EDD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(copackingrun && copackingrun.products) ? copackingrun.products.map(p => (
                  <TableRow
                    key={p.name}
                    className="clickable-row"
                    onClick={() => this.openProductSKUDetails(p.product_id)}
                  >
                    <TableCell align="left">{p.product_name}</TableCell>
                    <TableCell>{p.packaging_type}</TableCell>
                    <TableCell>{p.packaging_quantity}</TableCell>
                    <TableCell>{p.estimated_units}</TableCell>
                    <TableCell>{p.estimated_time}</TableCell>
                    <TableCell>{p.shipment_volume}</TableCell>
                    <TableCell>{p.inbound_shipment_type === 'pallet' ? 'Pallet' : p.inbound_shipment_tracking}</TableCell>
                    <TableCell>{p.inbound_shipment_edd}</TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
          </Paper>
          {copackingrun ? (
            <Row>
              <Col className="p-4 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                <button className="btn btn-main active" onClick={this.handlePrintEmail}>Print</button>
              </Col>
            </Row>
          ) : null}
        </Container>

        <ModalSKUDetails
          showModal={skuModal}
          toggleModal={this.toggleModal}
          product={selectedProduct}
          copackingRun={selectedCopackingRun}
        />
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRunsSpecific)
