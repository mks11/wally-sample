import React, {Component} from 'react';
import {
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
} from 'reactstrap';
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import CustomDropdown from '../common/CustomDropdown'
import FulfillmentPlaceView from './manage/FulfillmentPlaceView'
import FulfillmentPackView from './manage/FulfillmentPackView'

import {connect} from '../utils'
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import {toJS} from 'mobx';
import SingleOrderView from "./manage/fulfillment/SingleOrderView";

class ManagePackaging extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: '1',
            timeframe: null,
            selectedOrder: null,
            singleOrderOpen: false
        };

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
                    this.loadOrders()
                    this.adminStore.getPackagings()

                }
            })
            .catch((error) => {
                this.props.store.routing.push('/')
            })
    }

    loadData() {
        const date = new Date()
        this.adminStore.getTimeFrames(date)
    }

    loadOrders = () => {
        const {route, timeframe} = this.state
        const options = this.userStore.getHeaderAuth()
        this.adminStore.getRouteOrders('all', timeframe, options)
    }

    onTimeFrameSelect = (timeframe) => {
        this.setState({
            timeframe
        }, () => this.loadOrders())
    }

    toggleSingleOrderView = ({order}) => {
        if (order) {
            this.setState({singleOrderOpen: true, selectedOrder: order})
        } else {
            this.setState({singleOrderOpen: false, selectedOrder: null})
            this.loadOrders()
        }
    }

    render() {
        if (!this.userStore.user) return null
        const {timeframes, packagings} = this.adminStore
        const {singleOrderOpen} = this.state
        const {orders} = this.adminStore
        return (
            <div className="App">
                <ManageTabs page="fulfillment"/>
                <Title content="Packaging Portal"/>
                {!singleOrderOpen ? <React.Fragment>
                        <section className="page-section pt-1 fulfillment-page">
                            <Container>
                                <Row>
                                    <Col md="6" sm="12">
                                        <div className="mb-3">
                                            <div className="mb-2 font-weight-bold">Time Frame:</div>
                                            <CustomDropdown
                                                values={timeframes.map(item => {
                                                    return {id: item, title: item}
                                                })}
                                                onItemClick={this.onTimeFrameSelect}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </section>

                        <section className="page-section pt-1 fulfillment-page">
                            <Container>
                                <Paper elevation={1} className={"scrollable-table"}>
                                    <Table className={"packaging-table"}>
                                        <TableHead>
                                            <TableRow>
                                              <TableCell>Order Letter</TableCell>
                                              <TableCell>Order ID</TableCell>
                                              <TableCell>Status</TableCell>
                                              <TableCell>Allergy Notes</TableCell>
                                              <TableCell>Order Notes</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders && orders.length > 0 &&
                                            orders.map(order => {
                                                return <TableRow
                                                        key={order._id}
                                                        className={`row ${order.status}`}
                                                        onClick={() => this.toggleSingleOrderView({order})}
                                                    >
                                                        <TableCell>{order.order_letter}</TableCell>
                                                        <TableCell>{order._id}</TableCell>
                                                        <TableCell
                                                            className={"text-capitalize"}>{order.status.replace('_', ' ')}</TableCell>
                                                        <TableCell
                                                          className={"text-capitalize"}>{order.allergy_notes}</TableCell>
                                                        <TableCell
                                                          className={"text-capitalize"}>{order.order_notes}</TableCell>
                                                    </TableRow>
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </Paper>
                                {/*   <FulfillmentPlaceView {...{ timeframe }} />
                <FulfillmentPackView {...{ timeframe }} />*/}
                            </Container>
                        </section>
                    </React.Fragment> :
                    <SingleOrderView toggle={this.toggleSingleOrderView} selectedOrder={this.state.selectedOrder}
                                     packagings={packagings}/>
                }
            </div>
        );
    }
}

export default connect("store")(ManagePackaging);
