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
      products: [],
      copackingrun: null,
      skuModal: false,
      selectedProduct: {},
    }
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
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

    // TODO remove this method
    this.adminStore.getCopackingRuns()

    this.adminStore.getCopackingRunProducts(runId)
      .then(data => {
        this.setState({ products: data })
      })
      .catch(error => {
        this.modalStore.toggleModal('error', 'Can\'t get co-packing runs products')
      })

    const copackingrun = this.adminStore.copackingruns.find(r => r.id == runId)
    this.setState({ copackingrun })
  }

  toggleModal = () => {
    this.setState({ skuModal: !this.state.skuModal })
  }

  openProductSKUDetails = productId => {
    const { products } = this.state

    this.setState({
      selectedProduct: products.find(p => p.id === productId)
    }, () => {
      this.toggleModal()
    })
  }

  render() {
    const {
      skuModal,
      products,
      copackingrun,
      selectedProduct,
    } = this.state

    return (
      <div className="App">
        <Title content={copackingrun && copackingrun.process} />
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
                {products.map(p => (
                  <TableRow
                    key={p.name}
                    className="clickable-row"
                    onClick={() => this.openProductSKUDetails(p.id)}
                  >
                    <TableCell align="left">{p.name}</TableCell>
                    <TableCell>{p.packagingType}</TableCell>
                    <TableCell>{p.packaging}</TableCell>
                    <TableCell>{p.units}</TableCell>
                    <TableCell>{p.time}</TableCell>
                    <TableCell>{p.volume}</TableCell>
                    <TableCell>{p.shipment_type === 'pallet' ? 'Pallet' : p.tracking_number}</TableCell>
                    <TableCell>{p.shipmentEDD}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          {copackingrun ? (
            <Row>
              <Col className="p-4 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                <a className="btn btn-main active" href={copackingrun.print_url}>Print</a>
              </Col>
            </Row>
          ) : null}
        </Container>

        <ModalSKUDetails
          showModal={skuModal}
          toggleModal={this.toggleModal}
          product={selectedProduct}
        />
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRunsSpecific)
