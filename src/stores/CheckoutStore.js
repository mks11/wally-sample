import {observable, decorate, action} from 'mobx'
import { 
  API_GET_CURRENT_CART,
  API_EDIT_CURRENT_CART,
  API_GET_ORDER_SUMMARY,
  API_DELIVERY_TIMES,
  API_CREATE_ORDER,
  API_CHECK_PROMO } from '../config'
import axios from 'axios'
import moment from 'moment'

class CheckoutStore {
  cart  = null
  order = null

  async clearCart(auth) {
    localStorage.removeItem('cart')
    return this.getCurrentCart(auth, {})
  }

  async getCurrentCart(auth, delivery) {
    let res

    const local = localStorage.getItem('cart')
    let url = API_GET_CURRENT_CART
    if (local) {
      this.cart = JSON.parse(local)
      url += '/' + this.cart._id
    }
    
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    url += '?time=' + currentTime
    url += '&delivery_zip=' + delivery.zip
    url += '&delivery_date=' + delivery.date

    if (auth.headers.Authorization === 'Bearer undefined') {
      res = await axios.get(url)
      localStorage.setItem('cart', JSON.stringify(res.data))
    } else {
      res = await axios.get(url, auth)
      localStorage.removeItem('cart')
    }
    this.cart = res.data
    return res.data
  }
  
  async editCurrentCart(data, auth, order_summary,delivery) {
    let cart_id
    if (this.cart) {
      cart_id = this.cart._id
    }
    if (order_summary) {
      cart_id = this.order.cart_id
    }

    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const url = `${API_EDIT_CURRENT_CART+cart_id}?time=${currentTime}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`
    let res
    if (auth.headers.Authorization === 'Bearer undefined') {
      res = await axios.patch(url, data)
    } else {
      res = await axios.patch(url, data, auth)
    }

    this.cart = res.data
    if (order_summary) {
      this.getOrderSummary(auth, delivery)
    }
  }

  async updateCartItems(delivery) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.patch(`${API_GET_CURRENT_CART}/items?time=${currentTime}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`, { cart_id: this.cart._id })
    this.order = res.data
    return res.data
  }

  async getOrderSummary(auth, delivery) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(`${API_GET_ORDER_SUMMARY}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`, auth)
    this.order = res.data
    return res.data
  }

  async createOrder(data, auth) {
    const res = await axios.post(`${API_CREATE_ORDER}?time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, data, auth)
    return res.data  
  }

  async check(id) {
    const resp = await axios.get(API_GET_ORDER_SUMMARY + id)
    this.order = resp.data
  }

  async getDeliveryTimes(data, auth) {
    // const res = await axios.get(`${API_DELIVERY_TIMES}?user_time=${moment().format('YYYY-MM-DD HH:mm:ss')}&zip=${data.zip}`, auth)
    const res = await axios.get(`${API_DELIVERY_TIMES}?user_time=${moment().format('YYYY-MM-DD HH:mm:ss')}`, auth)
    return res.data
  }

  async checkPromo(data, auth) {
    let res
    if (!data.subTotal) {
      res = await axios.get(`${API_CHECK_PROMO}/?promo_code=${data.promoCode}`, auth)
    } else {
      res = await axios.get(`${API_CHECK_PROMO}/?subtotal=${data.subTotal}&promo_code=${data.promoCode}`, auth)
    }
    this.order = res.data
    return res.data
  }

  transformDeliveryTimes(data) {
    if (!data) return

    let deliveryTimes = []
    const times = data.delivery_windows
    for (var i = 0, len = times.length; i < len; i++) {
      addTimes(times[i])
    }

    function addTimes(data) {
      const timeFirst = data[0].split('-')[0]
      const toProvide = data[1] + ' ' + timeFirst
      const day = moment(toProvide, 'YYYY-MM-DD h:mm').calendar(null,{
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
      })

      const findTime = deliveryTimes.findIndex((data) => data.day === day)

      const obj = {
        time: data[0],
        date: data[1],
        availability: data[2]
      }

      if (findTime === -1) {
        deliveryTimes.push({day: day, data: [obj]})
      } else {
        deliveryTimes[findTime].data.push(obj)
      }
    }

    return deliveryTimes
  }

}

decorate(CheckoutStore, {
  cart: observable,
  order: observable,
  getCurrentCart: action,
  editCurrentCart: action,
  getOrderSummary: action,
  checkPromo: action,
  transformDeliveryTimes: action
})


export default new CheckoutStore()
