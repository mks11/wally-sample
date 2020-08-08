import React, {Component} from 'react';
import {
  Row,
  Col,
  Container,
  Table,
} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import CustomDropdown from '../common/CustomDropdown'
import OrderDetailView from './manage/delivery/OrderDetailView'

import {connect} from '../utils'
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

class ManageDelivery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOrder: null,
      singleOrderOpen: false,
      timeframe: null
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
    const date = +new Date()
    this.adminStore.getTimeFrames(date)
  }

  loadRoutes = (timeframe) => {
    const options = this.userStore.getHeaderAuth()
    this.setState({timeframe})
    this.adminStore.getRoutes(timeframe, options)
  };

  loadOrders = (routeId) => {
    const options = this.userStore.getHeaderAuth()
    const {timeframe} = this.state
    this.adminStore.getRouteOrders(routeId, timeframe, options)
  }

  toggleOrder = (routeId) => {
    if (routeId) {
      this.setState({
        selectedOrder: routeId,
        selectedRoute: null,
        singleOrderOpen: true
      })
    } else {
      this.setState({
        selectedOrder: null,
        selectedRoute: null,
        singleOrderOpen: false
      })
    }
  }

  render() {
    if (!this.userStore.user) return null

    const {timeframes, routes, orders} = this.adminStore
    const {selectedOrder, singleOrderOpen} = this.state

    return (
      <div className="App">
        <ManageTabs page="delivery"/>
        <Title content={singleOrderOpen ? 'Single Order View' : "Delivery Portal"}/>
        {!singleOrderOpen ? <React.Fragment>
          <section className="page-section pt-1 delivery-page">
            <Container>
              <Row>
                <Col md="6" sm="12">
                  <div className="mb-3">
                    <div className="mb-2 font-weight-bold">Time Frame:</div>
                    <CustomDropdown
                      values={timeframes.map(item => {
                        return {id: item, title: item}
                      })}
                      onItemClick={this.loadRoutes}
                    />
                  </div>
                </Col>
                <Col md="6" sm="12">
                  <div className="mb-3">
                    <div className="mb-2 font-weight-bold">Delivery Route:</div>
                    <CustomDropdown
                      values={[
                        {id: 'all', title: 'All'}
                          ,...routes.map(item => {
                        return {id: item._id, title: item.route_number}
                      })]}
                      onItemClick={this.loadOrders}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="page-section pt-1 delivery-page">
            <Container>
              <h2>Orders</h2>
              <hr className={"line"}/>
              <Table className={"delivery-table"}>
                <TableBody>
                  {orders && orders.map((order, i) => {
                    return (
                      <TableRow
                        className={`row ${order.status}`}
                        key={order._id}
                        onClick={() => this.toggleOrder(order._id)}
                      >
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.street_address}</TableCell>
                        <TableCell>{order.user_name}</TableCell>
                        <TableCell>{order.telephone}</TableCell>
                        <TableCell>NEW USER - TODO</TableCell>
                        <TableCell className={"text-capitalize"}>{order.status.replace('_',' ')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Container>
          </section>
        </React.Fragment> : null}
        {selectedOrder ? <OrderDetailView orderId={selectedOrder} toggle={() => this.toggleOrder()}/> : null}
      </div>
    );
  }
}

export default connect("store")(ManageDelivery);
