import React, { Component } from 'react';
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

import { connect } from '../utils'

class ManageFulfillment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: '1',
      timeframe: null
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

  onTimeFrameSelect = (timeframe) => {
    this.setState({
      timeframe
    })
  }

  toggle = (e) => {
    const tab = e.target.getAttribute('tab-id')
    if (tab && this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    if (!this.userStore.user) return null

    const { timeframes } = this.adminStore
    const { timeframe } = this.state
      
    return (
      <div className="App">
        <ManageTabs page="fulfillment" />
        <Title content="Fulfillment Portal" />

        <section className="page-section pt-1 fulfillment-page">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Time Frame:</div>
                  <CustomDropdown
                    values={timeframes}
                    onItemClick={this.onTimeFrameSelect}
                    title="Time Frame"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-section pt-1 fulfillment-page">
          <Container>
            <Nav tabs>
              <NavItem>
                <NavLink
                  tab-id="1"
                  className={`${this.state.activeTab === '1' ? 'active' : '' }`}
                  onClick={this.toggle}
                >
                  Place
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tab-id="2"
                  className={`${this.state.activeTab === '2' ? 'active' : '' }`}
                  onClick={this.toggle}
                >
                  Pack
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <FulfillmentPlaceView {...{ timeframe }} />
              </TabPane>
              <TabPane tabId="2">
                <FulfillmentPackView {...{ timeframe }} />
              </TabPane>
            </TabContent>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageFulfillment);
