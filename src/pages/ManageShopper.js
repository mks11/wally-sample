import React, { Component } from 'react';
import {
  Row,
  Col,
  Container,
} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import ShopperTable from './manage/ShopperTable'
import CustomDropdown from '../common/CustomDropdown'

import { connect } from '../utils'

class ManageShopper extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
          this.loadTimeFramesData()
        }
      })
  }

  loadTimeFramesData() {
    this.adminStore.getTimeFrames()
  }

  loadShopLocations = (timeframe) => {
    this.adminStore.getShopLocations(timeframe)
    this.setState({ timeframe })
  }

  loadShopItems = (e) => {
    const location = e.target.getAttribute('attr-id')
    const { timeframe } = this.state
    this.adminStore.getShopItems(timeframe, location)
    this.adminStore.getShopItemsFarms(timeframe, location)
  }

  render() {
    if (!this.userStore.user) return null

    const {
      timeframes,
      locations,
      shopitems,
      shopitemsFarms
    } = this.adminStore

    return (
      <div className="App">
        <ManageTabs page="shopper" />
        <Title content="Shopper Portal" />

        <section className="page-section pt-1">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Time Frame:</div>
                  <CustomDropdown
                    values={timeframes}
                    onItemClick={this.loadShopLocations}
                    title="Time Frame"
                  />
                </div>
              </Col>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Location:</div>
                  {
                    locations && locations.map(item => {
                      return (
                        <div
                          key={item}
                          className="shopper-location"
                          onClick={this.loadShopItems}
                          attr-id={item}
                        >
                          {item}
                        </div>
                      )
                    })
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-section pt-1">
          <Container>
            <h2>Shop Location View</h2>
            <ShopperTable {...{ shopitems, shopitemsFarms }} />
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageShopper);
