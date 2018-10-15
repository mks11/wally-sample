import React, { Component } from 'react';
import {
  Row,
  Col,
  Container,
  Table,
  Button,
} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import CustomDropdown from '../common/CustomDropdown'
import OrderDetailView from './manage/delivery/OrderDetailView'

import { connect } from '../utils'

class ManageDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOrder: null
    }

    this.userStore = this.props.store.user
    this.adminStore = this.props.store.admin
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
          this.props.store.routing.push('/')
        } else {
          this.loadData()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadData() {
    const date = + new Date()
    this.adminStore.getTimeFrames(date)
  }

  loadRoutes = (timeframe) => {
    this.adminStore.getRoutes(timeframe)
  }

  loadOrders = (e) => {
    const routeId = e.target.getAttribute('attr-id')
    this.adminStore.getRouteOrders(routeId)
  }

  openOrder = (e) => {
    const routeId = e.target.getAttribute('order-id')
    this.setState({
      selectedOrder: routeId,
      selectedRoute: null,
    })
  }

  render() {
    if (!this.userStore.user) return null

    const { timeframes, routes, orders } = this.adminStore
    const { selectedOrder } = this.state
      
    return (
      <div className="App">
        <ManageTabs page="delivery" />
        <Title content="Delivery Portal" />

        <section className="page-section pt-1 delivery-page">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Time Frame:</div>
                  <CustomDropdown
                    values={timeframes}
                    onItemClick={this.loadRoutes}
                    title="Time Frame"
                  />
                </div>
              </Col>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Delivery Route:</div>
                  {
                    routes && routes.map(item => {
                      return (
                        <div
                          key={item.id}
                          className="shopper-location"
                          onClick={this.loadOrders}
                          attr-id={item.id}
                        >
                          {item.route_number}
                        </div>
                      )
                    })
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-section pt-1 delivery-page">
          <Container>
            <h2>Orders</h2>
            <Table responsive>
              <tbody>
                {
                  orders && orders.map(item => {
                    let status = ''
                    switch(item.status) {
                      case 'paid':
                        status = 'Incomplete'
                        break
                      case 'delivery_issue':
                        status = 'Missing'
                        break
                      case 'delivered':
                        status = 'Delivered'
                        break
                      default:
                        break
                    }

                    return (
                      <tr key={item.id}>
                        <td>Order #{item.id}</td>
                        <td>{item.street_address}</td>
                        <td>{status}</td>
                        <td>
                          <Button
                            color="primary"
                            order-id={item.id}
                            onClick={this.openOrder}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </Container>
        </section>

        { selectedOrder ? <OrderDetailView orderId={selectedOrder} onSubmit={this.onOrderSubmit} /> : null}
      </div>
    );
  }
}

export default connect("store")(ManageDelivery);
