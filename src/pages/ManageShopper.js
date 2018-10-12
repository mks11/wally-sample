import React, { Component } from 'react';
import { Container, Table} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from '../common/ManageTabs'

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
          this.loadData()
        }
      })
  }

  loadData() {
    const date = + new Date()
    this.adminStore.getTimeFrames(date)
    this.adminStore.getShopLocations()
  }

  render() {
    if (!this.userStore.user) return null
      
    return (
      <div className="App">
        <ManageTabs page="shopper" />
        <Title content="Shopper Portal" />

        <section className="page-section pt-1">
          <Container>
            <Table responsive>
              <thead>
                <tr>
                  <th scope="col">Time Frame:</th>
                  <th scope="col">Location:</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </Table>
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
