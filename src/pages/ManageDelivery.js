import React, { Component } from 'react';
import { Input  } from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from '../common/ManageTabs'

import { connect } from '../utils'

class ManageDelivery extends Component {
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
        <ManageTabs page="delivery" />
        <Title content="Delivery Portal" />

        <section className="page-section pt-1">
          <div className="container">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Time Frame:</th>
                    <th scope="col">Delivery Route:</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="page-section pt-1">
          <div className="container">
            <h2>Orders</h2>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageDelivery);
