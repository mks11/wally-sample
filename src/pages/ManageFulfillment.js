import React, { Component } from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col
} from 'reactstrap';
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'

import { connect } from '../utils'

class ManageFulfillment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: '1'
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
  }

  loadData() {
    const date = + new Date()
    this.adminStore.getTimeFrames(date)
    this.adminStore.getShopLocations()
  }

  toggle = (e) => {
    const tab = e.target.getAttribute('tab-id')
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    if (!this.userStore.user) return null
      
    return (
      <div className="App">
        <ManageTabs page="fulfillment" />
        <Title content="Fulfillment Portal" />

        <section className="page-section pt-1">
          <Container>
            <Nav tabs>
              <NavItem>
                <NavLink
                  tab-id="1"
                  className={`${this.state.activeTab === '1' ? 'active' : '' }`}
                  onClick={this.toggle}
                >
                  <b>Place</b>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tab-id="2"
                  className={`${this.state.activeTab === '2' ? 'active' : '' }`}
                  onClick={this.toggle}
                >
                  <b>Pack</b>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col>

                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col>
                    
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageFulfillment);
