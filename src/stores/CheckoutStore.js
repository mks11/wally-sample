import {observable, decorate, action} from 'mobx'
import { 
  API_GET_CURRENT_CART, API_EDIT_CURRENT_CART,
  API_GET_ORDER_SUMMARY, API_DELIVERY_TIMES,
  API_CHECK_PROMO } from '../config'
import axios from 'axios'

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
  
  async editCurrentCart(data, auth) {
    const res = await axios.patch(API_EDIT_CURRENT_CART+this.cart._id+'?time=2018-08-20 08:00:00', data, auth)
    this.cart = res.data
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
    const resp = await axios.get(API_DELIVERY_TIMES, data, auth)
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
