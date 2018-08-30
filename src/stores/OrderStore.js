import {observable, decorate, action} from 'mobx'
import { 
  API_GET_ORDERS, API_SUBMIT_ISSUE
   } from '../config'
import axios from 'axios'
import moment from 'moment'

let index = 0

class OrderStore {
  orders  = []
  reportModal = false
  activeOrder = null

  async getOrders(auth) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(API_GET_ORDERS + '?time='+ time, auth)
    this.orders = res.data
  }

  toggleReport(order) {
    this.reportModal = !this.reportModal
    if (this.reportModal) {
      this.activeOrder = order
    }
  }

  async submitIssue(data, auth) {
    const res = await axios.post(API_SUBMIT_ISSUE, data, auth)
    return res
  }


}

decorate(OrderStore, {
  orders: observable,
  activeOrder: observable,
  reportModal: observable,
  getOrders: action,
  toggleReport: action
})


export default new OrderStore()
