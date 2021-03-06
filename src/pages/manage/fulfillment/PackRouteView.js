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

class PackRouteView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      route: null,
      route_placement: '',
    }

    this.adminStore = this.props.store.admin
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    this.loadOrders()
  }

  componentDidUpdate(_, prevState) {
    if (prevState.route !== this.state.route) {
      this.loadOrders()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.route !== prevState.route){
      return { route: nextProps.route }
    }
    else return null;
  }

  loadOrders = () => {
    const { route } = this.state
    const options = this.userStore.getHeaderAuth()
    this.adminStore.getRouteOrders(route._id, options)
  }

  onRouteUpdate = (e) => {
    this.setState({
      route_placement: e.target.value,
    })
  }

  onRouteUpdateSubmit = () => {
    const { route, route_placement } = this.state
    const payload = { route_placement }
    const options = this.userStore.getHeaderAuth()
    this.adminStore.updateRoutePlacement(route._id, payload, options)
  }

  render() {
    const { orders } = this.adminStore
    const { route, route_placement } = this.state
    const { onOrderClick } = this.props
    return (
      <section className="page-section pt-1">
        <Container>
          <Row>
            <Col>
              <h2>{route.route_number} Orders:</h2>
              <Input placeholder="Write lane number, cart number" value={route_placement} onChange={this.onRouteUpdate} />
              <Button color="primary" className="my-2" onClick={this.onRouteUpdateSubmit}>Submit</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table responsive className="pack-route-table mt-5">
                <thead>
                  <tr>
                    <th scope="col">Order #</th>
                    <th scope="col">Pack Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders && orders.map(item => {
                      return (
                        <tr key={item._id} >
                          <td>Order #{item._id}</td>
                          <td>
                            <Button
                              color="primary"
                              order-id={item._id}
                              onClick={onOrderClick}
                            >
                              {item.status === 'submitted' ? 'Start Order' : 'View Order'}
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </section>
    )
  }
}

export default connect('store')(PackRouteView)
