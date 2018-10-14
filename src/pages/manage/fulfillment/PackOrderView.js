import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
} from 'reactstrap'
import { connect } from '../../../utils'

class PackOrderView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      editedPackagings: {},
      editedQuantities: {}
    }

    this.adminStore = this.props.store.admin
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
    const { timeframe } = this.props

    this.adminStore.getOrder(orderId)
    this.adminStore.getPackagings()
    this.adminStore.getShopItems(timeframe, 'all')
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
    const { editedPackagings, editedQuantities, orderId } = this.state
    const { onSubmit } = this.props

    const packagings = Object.keys(editedPackagings).map(key => {
      return {
        type: key,
        quantity: editedPackagings[key],
      }
    })
    const item_quantities = Object.keys(editedQuantities).map(key => {
      return {
        product_id: key,
        quantity: editedQuantities[key],
      }
    })
    
    const payload = {
      packagings,
      item_quantities,
    }

    this.adminStore.packageOrder(orderId, payload)
    onSubmit && onSubmit()
  }

  render() {
    const { singleorder, packagings, shopitems } = this.adminStore
    const { editedPackagings, editedQuantities } = this.state

    return (
      <section className="page-section">
        <Container>
          <Row className="pack-order-details">
            <Col>Order # {singleorder.id}</Col>
            <Col>Name: {singleorder.user_name}</Col>
            <Col>Phone Number: {singleorder.telephone}</Col>
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-order-table my-5">
                <thead>
                  <tr>
                    <th scope="col" width="8%">Organic (Y/N)</th>
                    <th scope="col" width="20%">Product</th>
                    <th scope="col" width="20%">Substitue for</th>
                    <th scope="col" width="15%">Farm</th>
                    <th scope="col" width="17%">Qty</th>
                    <th scope="col" width="20%">Product placement</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    shopitems && shopitems.map(item => {
                      return (
                        <tr key={item.product_id} >
                          <td>{item.organic ? "Y" : "N"}</td>
                          <td>{item.product_name}</td>
                          <td>{item.substitute_for_name}</td>
                          <td>{item.product_producer}</td>
                          <td>
                          <Row noGutters>
                            <Col xs="6"><b>Unit:</b></Col>
                            <Col xs="6"><b>Qty:</b></Col>
                            <Col xs="6">{item.price_unit}</Col>
                            <Col xs="6">{item.quantity}</Col>
                            <Col xs="12">
                              <Input
                                placeholder="Enter actual qty (if different)"
                                onChange={this.onQtyChange}
                                value={editedQuantities[item.product_id] || ''}
                                prod-id={item.product_id}
                                type="number"
                              />
                            </Col>
                          </Row>
                          </td>
                          <td>{item.warehouse_placement}</td>
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
              <Table responsive className="pack-order-table-bags">
                <tbody>
                  {
                    packagings && packagings.map(item => {
                      return (
                        <tr key={item.id} >
                          <td>{item.type}</td>
                          <td>
                            <Input
                              placeholder="Enter # bags"
                              package-id={item.id}
                              value={editedPackagings[item.id] || ''}
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

export default connect('store')(PackOrderView)
