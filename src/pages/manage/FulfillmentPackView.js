import React, { Component } from 'react'
import {
  Container,
  Table,
  Button,
} from 'reactstrap'
import { connect } from '../../utils'
import PackRouteView from './fulfillment/PackRouteView'
import PackOrderView from './fulfillment/PackOrderView'

class FulfillmentPackView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeframe: this.props.timeframe,
      selectedRoute: null,
      selectedOrder: null, 
    }

    this.adminStore = this.props.store.admin
  }

  componentDidUpdate(_, prevState) {
    if (prevState.timeframe !== this.state.timeframe) {
      this.loadRoutes()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.timeframe !== prevState.timeframe){
      return { timeframe: nextProps.timeframe }
    }
    else return null;
  }

  loadRoutes = () => {
    const { timeframe } = this.state
    this.adminStore.getRoutes(timeframe)
  }

  openRoute = (e) => {
    const routeId = e.target.getAttribute('route-id')
    const { routes } = this.adminStore
    const selectedRoute = routes.find(item => item.id === routeId)
    this.setState({
      selectedRoute,
      selectedOrder: null,
    })
  }

  openOrder = (e) => {
    const routeId = e.target.getAttribute('order-id')
    this.setState({
      selectedOrder: routeId,
      selectedRoute: null,
    })
  }

  onOrderSubmit = () => {
    this.setState({
      selectedOrder: null,
      selectedRoute: null,
    })
  }

  render() {
    const { routes } = this.adminStore
    const { selectedRoute, selectedOrder, timeframe } = this.state

    return (
      <Container>
        <h2 className="py-3">Pack:</h2>
        <Table responsive className="pack-table">
          <tbody>
            {
              routes && routes.map(item => {
                return (
                  <tr key={item.id} >
                    <td>{item.route_number}</td>
                    <td>
                      <Button
                        color="primary"
                        route-id={item.id}
                        onClick={this.openRoute}
                      >
                        {item.status === 'packed' ? 'View Orders' : 'Pack Orders'}
                      </Button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        { selectedRoute ? <PackRouteView route={selectedRoute} onOrderClick={this.openOrder} /> : null}
        { selectedOrder ? <PackOrderView orderId={selectedOrder} timeframe={timeframe} onSubmit={this.onOrderSubmit} /> : null}
      </Container>
    )
  }
}

export default connect('store')(FulfillmentPackView)
