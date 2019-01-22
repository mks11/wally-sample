import React, {Component} from 'react'
import {Col, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table,} from 'reactstrap'
import {connect} from '../../../utils'
import CloseIcon from '@material-ui/icons/Close'
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button/Button"
import Grid from "@material-ui/core/Grid/Grid"
import Select from "react-select"

const missingReasonOptions = [
  {label: 'No answer', value: "No answer"},
  {label: 'Wrong address', value: "Wrong address"},
  {label: 'Other', value: "Other"}
]

class OrderDetailView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      orderId: null,
      editedPackagings: {},
      status: null,
      isMissingModalOpen: false,
      isDeliveredModalOpen: false,
      missingReason: null
    }

    this.adminStore = this.props.store.admin
    this.userStore = this.props.store.user
  }

  componentDidMount () {
    this.loadSingleOrder()
  }

  componentDidUpdate (_, prevState) {
    if (prevState.orderId !== this.state.orderId) {
      this.loadSingleOrder()
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.orderId !== prevState.orderId) {
      return {orderId: nextProps.orderId}
    } else return null
  }

  loadSingleOrder = () => {
    const {orderId} = this.state
    const options = this.userStore.getHeaderAuth()

    this.adminStore.getOrder(orderId, options)
    this.adminStore.getPackagings()
  }

  onPackageNumberChange = (e) => {
    const {editedPackagings} = this.state

    const value = e.target.value
    const packageId = e.target.getAttribute('package-id')

    const {[packageId.toString()]: omit, ...rest} = editedPackagings

    this.setState({
      editedPackagings: {
        [packageId]: value,
        ...rest,
      }
    })
  }

  onQtyChange = (e) => {
    const {editedQuantities} = this.state

    const value = e.target.value
    const productId = e.target.getAttribute('prod-id')

    const {[productId.toString()]: omit, ...rest} = editedQuantities

    this.setState({
      editedQuantities: {
        [productId]: value,
        ...rest,
      }
    })
  }

  onSubmit = () => {
    const {editedPackagings, orderId, missingReason, isMissingModalOpen, isDeliveredModalOpen} = this.state
    const {packagings} = this.adminStore
    const {onSubmit} = this.props

    let status = 'delivered'

    const packaging_returns = packagings.map(packaging => {
      return {
        type: packaging.type,
        quantity: Number(editedPackagings[packaging._id]) || 0,
      }
    })

    if (isMissingModalOpen) status = missingReason.value

    const payload = {
      packaging_returns,
      status,
    }
    const options = this.userStore.getHeaderAuth()

    this.adminStore.completeOrder(orderId, payload, options)
    onSubmit && onSubmit()
    this.props.toggle({})
  }

  updateStatus = (status) => {
    let statusValue = status === 'Delivered' ? 'delivered' : 'delivery_issue'

    this.setState({
      status: statusValue
    })
  }

  toggleMissingModal = () => {
    this.setState({isMissingModalOpen: !this.state.isMissingModalOpen})
  }

  toggleDeliveredModal = () => {
    this.setState({isDeliveredModalOpen: !this.state.isDeliveredModalOpen})
  }

  render () {
    const {singleorder, packagings} = this.adminStore
    const {editedPackagings, isMissingModalOpen, missingReason,isDeliveredModalOpen} = this.state
    return (
      <section className="page-section delivery-page pt-2">
        <Container>
          <Row>
            <div className="mb-3">
              <Button variant="contained" color="default" onClick={this.props.toggle}>
                <CloseIcon/>
                <Typography>Close</Typography>
              </Button>
            </div>
          </Row>
          <Row className="pack-order-details">
            <Col xs="4">Order # {singleorder._id}</Col>
            <Col xs="4">Name: {singleorder.user_name}</Col>
            <Col xs="4">Phone Number: {singleorder.telephone}</Col>
            <Col
              xs="12">Address: {singleorder.street_address}, {singleorder.city}, {singleorder.state} {singleorder.zip}</Col>
          </Row>
          <Row className="pack-order-details">
            <Col>Address: {singleorder.street_address}</Col>
          </Row>
          <Row className="pack-order-details">
            <Col>Delivery Notes: {singleorder.delivery_notes}</Col>
          </Row>
          <Row className="pack-order-details">
            <Col>New user: TRUE - TODO</Col>
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-order-table-bags">
                <tbody>
                {
                  packagings && packagings.map(item => {
                    return (
                      <tr key={item._id}>
                        <td>{item.type}</td>
                        <td>
                          <Input
                            placeholder="Enter # bags"
                            package-id={item._id}
                            value={editedPackagings[item._id] || ''}
                            onChange={this.onPackageNumberChange}
                          />
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            </Col>
          </Row>
          {/*<Row>
            <Col className="my-3">
              <CustomDropdown
                values={[
                  { id: 'Delivered', title: 'Delivered' },
                  { id: 'Didn’t Respond', title: 'Didn’t Respond' },
                  { id: 'Couldn’t Contact', title: 'Couldn’t Contact' }
                ]}
                onItemClick={this.updateStatus}
              />
            </Col>
          </Row>*/}
          <Grid container justify={"center"}>
            <Grid item xs={4} className={"d-flex m-2"}>
              <Button fullWidth={true} color="primary" variant={"contained"}
                      onClick={this.toggleMissingModal}>Missing</Button>
            </Grid>
            <Grid item xs={4} className={"d-flex m-2"}>
              <Button fullWidth={true} color="primary" variant={"contained"}
                      onClick={this.toggleDeliveredModal}>Delivered</Button>
            </Grid>
          </Grid>
        </Container>
        <Modal isOpen={isMissingModalOpen} toggle={this.toggleMissingModal} className="missing-modal">
          <ModalHeader toggle={this.toggleMissingModal}>Delivery Missing</ModalHeader>
          <ModalBody>
            <Grid container>
              <Grid item xs={12}>
                <label>
                  Reason for delivery missing:
                </label>
              </Grid>
              <Grid item xs={12}>
                <Select value={missingReason} options={missingReasonOptions}
                        onChange={missingReason => this.setState({missingReason})}/>
              </Grid>
              <Grid item xs={12}>
                <p>
                  Please select a reason for missing delivery.
                </p>
              </Grid>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="contained" color="primary" size={"large"} type={"button"}
                    disabled={!missingReason}
                    onClick={this.onSubmit}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={isDeliveredModalOpen} toggle={this.toggleDeliveredModal} className="missing-modal">
          <ModalHeader toggle={this.toggleDeliveredModal}>Delivered</ModalHeader>
          <ModalBody>
            <Grid container>
              <Grid item xs={12}>
                <p>
                  Please confirm the delivery.
                </p>
              </Grid>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="contained" color="primary" size={"large"} type={"button"}
                    onClick={this.onSubmit}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>
    )
  }
}

export default connect('store')(OrderDetailView)
