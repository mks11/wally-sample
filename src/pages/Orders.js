import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'

import  ReportModal from './orders/ReportModal'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal

    this.userStore.getStatus()
      .then((status) => {
        if (!status) {
          this.modalStore.toggleLogin()
          this.props.store.routing.push('/main')
        }
      })
  }
  render() {
    const store = this.props.store
    return (
      <div className="App">
        <Title content="Orders" />
        <section className="page-section aw--orders">
          <div className="container">
            <div className="order-item">
              <table>
                <thead>
                  <tr>
                    <th className="pr-4">Orders placed</th>
                    <th className="pr-4">Items</th>
                    <th className="pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>May 07, 2018</td>
                    <td>8</td>
                    <td>$27.99</td>
                  </tr>
                </tbody>
              </table>
              <hr className="my-1"/>
              <span className="text-bold">Order #: 123456</span><br/>
              <span>lemon, broccali, cauliflower, butter, almond milk, cheese, meat, napa cabbage,
                roast beef, salmon</span>
              <a onClick={e => store.modal.toggleReport(e)} className="text-report text-blue">Report a Problem</a>
            </div>
            <div className="order-item mt-5">

              <table>
                <thead>
                  <tr>
                    <th className="pr-4">Package returned</th>
                    <th className="pr-4">Items</th>
                    <th className="pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>May 07, 2018</td>
                    <td>8</td>
                    <td>$27.99</td>
                  </tr>
                </tbody>
              </table>
              <hr className="my-1"/>
              <span className="text-bold">Order #: 123456</span><br/>
              <span>std(1), wrap std (2)</span>
              <a onClick={e => store.modal.toggleReport(e)} className="text-report text-blue">Report a Problem</a>
            </div>
            <div className="order-item mt-5">
              <table>
                <thead>
                  <tr>
                    <th className="pr-4">Orders placed</th>
                    <th className="pr-4">Items</th>
                    <th className="pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>May 07, 2018</td>
                    <td>8</td>
                    <td>$27.99</td>
                  </tr>
                </tbody>
              </table>

              <hr className="my-1"/>
              <span className="text-bold">Order #: 123456</span><br/>
              <span>lemon, broccali, cauliflower, butter, almond milk, cheese, meat, napa cabbage,
                roast beef, salmon</span>
              <a onClick={e => store.modal.toggleReport(e)} className="text-report text-blue">Report a Problem</a>
            </div>
            <div className="order-item mt-5">
              <table>
                <thead>
                  <tr>
                    <th className="pr-4">Orders placed</th>
                    <th className="pr-4">Items</th>
                    <th className="pr-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>May 07, 2018</td>
                    <td>8</td>
                    <td>$27.99</td>
                  </tr>
                </tbody>
              </table>
              <hr className="my-1"/>
              <span className="text-bold">Order #: 123456</span><br/>
              <span>lemon, broccali, cauliflower, butter, almond milk, cheese, meat, napa cabbage,
                roast beef, salmon</span>
              <a onClick={e => store.modal.toggleReport(e)} className="text-report text-blue">Report a Problem</a>
            </div>
          </div>
      </section>
      <ReportModal/>
    </div>
    );
  }
}

export default connect("store")(Orders);
