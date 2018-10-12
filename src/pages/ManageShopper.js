import React, { Component } from 'react';
import {
  Row,
  Col,
  Container,
  Table,
} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from '../common/ManageTabs'
import CustomDropdown from '../common/CustomDropdown'

import { connect } from '../utils'

class ManageShopper extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
  }

  render() {
    if (!this.userStore.user) return null

    const { timeframes, locations } = this.adminStore

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
                    frames={timeframes}
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
                      return (<div key={item}>{item}</div>)
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
            <Table responsive>
              <thead>
                <tr>
                  <th scope="col">Organic</th>
                  <th scope="col">Product</th>
                  <th scope="col">Farm</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Price</th>
                  <th scope="col">Purchase</th>
                  <th scope="col">Box #</th>
                  <th scope="col">Edit Item</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </Table>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageShopper);
