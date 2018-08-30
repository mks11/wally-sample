import {observable, decorate, action} from 'mobx'
import { 
  API_GET_CURRENT_CART, API_EDIT_CURRENT_CART,
  API_GET_ORDER_SUMMARY, API_DELIVERY_TIMES,
API_CREATE_ORDER,
  API_CHECK_PROMO } from '../config'
import axios from 'axios'
import moment from 'moment'

let index = 0

class CheckoutStore {
  cart  = null
  order = null

  deleteModal = null
  deleteId = null


  async getCurrentCart(auth) {
    let res

    const local = localStorage.getItem('cart')
    let url = API_GET_CURRENT_CART
    if (local) {
      this.cart = JSON.parse(local)
      url += '/' + this.cart._id
    }
    
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    url += '?time=' + time


    if (auth.headers.Authorization === 'Bearer undefined') {
      res = await axios.get(url)
      localStorage.setItem('cart', JSON.stringify(res.data))
    } else {
      res = await axios.get(url, auth)
      localStorage.removeItem('cart')
    }
    this.cart = res.data
  }
  
  async editCurrentCart(data, auth, order_summary) {
    let cart_id
    if (this.cart) {
      cart_id = this.cart._id
    }
    if (order_summary) {
      cart_id = this.order.cart_id
    }

    let res
    if (auth.headers.Authorization === 'Bearer undefined') {
      res = await axios.patch(`${API_EDIT_CURRENT_CART+cart_id}?time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data)
    } else {
      res = await axios.patch(`${API_EDIT_CURRENT_CART+cart_id}?time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data, auth)
    }

    this.cart = res.data
    if (order_summary) {
      this.getOrderSummary(auth)
    }
  }

  async getOrderSummary(auth) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(API_GET_ORDER_SUMMARY + '?time=' + time, auth)
    this.order = res.data
    return res.data
  }

  async createOrder(data, auth) {
    const res = await axios.post(`${API_CREATE_ORDER}?user_time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data, auth)
    return res.data  }

  async check(id) {
    const resp = await axios.get(API_GET_ORDER_SUMMARY + id)
    this.order = resp.data
  }

  async getDeliveryTimes(data, auth) {
    const res = await axios.get(`${API_DELIVERY_TIMES}?user_time=${moment().format('YYYY-MM-DD HH:mm:ss')}&zip=${data.zip}`, auth)
    return res.data
  }

  async applyPromo() {
    try {
      const resp = await axios.get(API_CHECK_PROMO)
      return true
    } catch(e) {
      return false
    }
  }

  toggleDeleteModal(id) {
    this.deleteModal = !this.deleteModal
    this.deleteId = id
  }

  async submitOrder(data, auth) {

  }

}

decorate(CheckoutStore, {
  cart: observable,
  order: observable,
  deleteModal: observable,
  deleteId: observable,
  getCurrentCart: action,
  editCurrentCart: action,
  getOrderSummary: action,
  applyPromo: action,
  toggleDeleteModal: action
})


export default new CheckoutStore()
