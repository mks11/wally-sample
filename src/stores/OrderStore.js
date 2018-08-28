import {observable, decorate, action} from 'mobx'
import { 
  API_GET_ORDERS
   } from '../config'
import axios from 'axios'

let index = 0

class OrderStore {
  orders  = []

  async getOrders(auth) {
    console.log('adfasfdas')
    const res = await axios.get(API_GET_ORDERS, auth)
    this.orders = res.data
  }

}

decorate(OrderStore, {
  orders: observable,
  getOrders: action
})


export default new OrderStore()
