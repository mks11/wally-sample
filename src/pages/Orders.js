import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect, formatMoney,capitalizeFirstLetter } from '../utils'
import moment from 'moment'

import  ReportModal from './orders/ReportModal'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
    this.modalStore = this.props.store.modal
    this.orderStore = this.props.store.order
  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        if (!status) {
          this.modalStore.toggleLogin()
          this.props.store.routing.push('/main')
          return
        }
        this.loadData()
      })
  }

  loadData() {
    this.orderStore.getOrders(this.userStore.getHeaderAuth()).then((data) => {
      // data loaded
    }).catch((e) => {
      console.error('Failed to load orders', e)
    })

  }

  countItems(data) {
    let total = 0 
    for (const d of data) {
      total += parseFloat(d.customer_quantity)
    }
    return total
  }

  printItems(data) {
    console.log(data)
    let items = []
    for (const d of data) {
      items.push(d.product_name)
    }
    return items.join(', ')
  }

  render() {
    const store = this.props.store
    return (
      <div className="App">
        <Title content="Orders" />
        <section className="page-section aw--orders">
          <div className="container">
            {this.orderStore.orders.map((item, key) => (
            <div className="order-item mt-2" key={key}>
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
                    <td>{moment(item.createAt).format('MMM DD, YYYY')}</td>
                    <td>{this.countItems(item.cart_items)}</td>
                    <td>{formatMoney(item.total/100)}</td>
                  </tr>
                </tbody>
              </table>
              <hr className="my-1"/>
              <span className="text-bold">Order #: {item.order_id}</span><br/>
              <span>{this.printItems(item.cart_items)}</span>
              <a onClick={e => this.orderStore.toggleReport(item)} className="text-report text-blue">Report a Problem</a>
            </div>
            ))}

            {/* 
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
            */}
          </div>
      </section>
      <ReportModal/>
    </div>
    );
  }
}

export default connect("store")(Orders);
