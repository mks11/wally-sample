import {observable, decorate, action} from 'mobx'
import { 
  API_GET_CURRENT_CART, API_EDIT_CURRENT_CART,
  API_GET_ORDER_SUMMARY, API_DELIVERY_TIMES,
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
    const res = await axios.get(API_GET_CURRENT_CART, auth)
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
    const res = await axios.patch(`${API_EDIT_CURRENT_CART+cart_id}?time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data, auth)
    this.cart = res.data
    if (order_summary) {
      this.getOrderSummary(auth)
    }
  }

  async getOrderSummary(auth) {
    const res = await axios.get(API_GET_ORDER_SUMMARY, auth)
    this.order = res.data
    return res.data
  }

  async createOrder(id) {
    const resp = await axios.get(API_GET_ORDER_SUMMARY + id)
    this.order = resp.data
  }

  async check(id) {
    const resp = await axios.get(API_GET_ORDER_SUMMARY + id)
    this.order = resp.data
  }

  async getDeliveryTimes(data, auth) {
    const resp = await axios.post(`${API_DELIVERY_TIMES}?time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data, auth)
    this.order = resp.data
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
