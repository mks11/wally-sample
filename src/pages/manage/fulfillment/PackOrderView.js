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
    this.adminStore.getOrder(orderId)
  }

  render() {
    const { singleorder } = this.adminStore

    return (
      <section className="page-section pt-1">
        <Container>
          <Row>
            <Col>Order # {singleorder.id}</Col>
            <Col>Name: {singleorder.user_name}</Col>
            <Col>Phone Number: {singleorder.telephone}</Col>
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-order-table">
                <thead>
                  <tr>
                    <th scope="col">Organic (Y/N)</th>
                    <th scope="col">Product</th>
                    <th scope="col">Substitue for</th>
                    <th scope="col">Farm</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Product placement</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {
                    orders && orders.map(item => {
                      return (
                        <tr key={item.id} >
                          <td>Order #{item.id}</td>
                          <td>
                            <Button
                              color="primary"
                              order-id={item.id}
                            >
                              {item.status === 'submitted' ? 'Start Order' : 'View Order'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  } */}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-order-table-bags">
                <tbody>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </section>
    )
  }
}

export default connect('store')(PackOrderView)
