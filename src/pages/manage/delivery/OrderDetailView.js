import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
} from 'reactstrap'
import CustomDropdown from '../../../common/CustomDropdown'
import { connect } from '../../../utils'

class OrderDetailView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      editedPackagings: {},
      status: null
    }

    this.adminStore = this.props.store.admin
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    this.loadSingleOrder()
  }

  componentDidUpdate(_, prevState) {
    if (prevState.orderId !== this.state.orderId) {
      this.loadSingleOrder()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.orderId !== prevState.orderId){
      return { orderId: nextProps.orderId }
    }
    else return null;
  }

  loadSingleOrder = () => {
    const { orderId } = this.state
    const options = this.userStore.getHeaderAuth()

    this.adminStore.getOrder(orderId, options)
    this.adminStore.getPackagings()
  }

  onPackageNumberChange = (e) => {
    const { editedPackagings } = this.state

    const value = e.target.value
    const packageId = e.target.getAttribute('package-id')

    const { [packageId.toString()]: omit, ...rest } = editedPackagings
    
    this.setState({
      editedPackagings: {
        [packageId]: value,
        ...rest,
      }
    })
  }

  onQtyChange = (e) => {
    const { editedQuantities } = this.state

    const value = e.target.value
    const productId = e.target.getAttribute('prod-id')

    const { [productId.toString()]: omit, ...rest } = editedQuantities
    
    this.setState({
      editedQuantities: {
        [productId]: value,
        ...rest,
      }
    })
  }

  onSubmit = () => {
    const { editedPackagings, status, orderId } = this.state
    const { onSubmit } = this.props

    const packaging_returns = Object.keys(editedPackagings).map(key => {
      return {
        type: key,
        quantity: editedPackagings[key],
      }
    })
    
    const payload = {
      packaging_returns,
      status,
    }

    this.adminStore.completeOrder(orderId, payload)
    onSubmit && onSubmit()
  }

  updateStatus = (status) => {
    let statusValue = status === 'Delivered' ? 'delivered' : 'delivery_issue'

    this.setState({
      status: statusValue
    })
  }

  render() {
    const { singleorder, packagings } = this.adminStore
    const { editedPackagings } = this.state

    return (
      <section className="page-section delivery-page">
        <Container>
          <Row className="pack-order-details">
            <Col xs="4">Order # {singleorder.id}</Col>
            <Col xs="4">Name: {singleorder.user_name}</Col>
            <Col xs="4">Phone Number: {singleorder.telephone}</Col>
            <Col xs="12">Address: {singleorder.street_address}, {singleorder.city}, {singleorder.state} {singleorder.zip}</Col>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-order-table-bags">
                <tbody>
                  {
                    packagings && packagings.map(item => {
                      return (
                        <tr key={item._id} >
                          <td>{item.type}</td>
                          <td>
                            <Input
                              placeholder="Enter # bags"
                              package-id={item._id}
                              value={editedPackagings[item._id] || ''}
                              onChange={this.onPackageNumberChange}
                              type="number"
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
          <Row>
            <Col>
              <Button color="primary" onClick={this.onSubmit}>Submit</Button>
            </Col>
          </Row>
        </Container>
      </section>
    )
  }
}

export default connect('store')(OrderDetailView)
