import { observable, decorate, action } from 'mobx';
import {
  API_GET_CURRENT_CART,
  API_EDIT_CURRENT_CART,
  API_GET_ORDER_SUMMARY,
  API_DELIVERY_TIMES,
} from '../config';
import axios from 'axios';
import moment from 'moment';

class CheckoutStore {
  cart = null;
  order = null;
  deliveryTimes = [];

  async clearCart(auth) {
    if (auth.headers.Authorization === 'Bearer undefined') {
      localStorage.removeItem('cart');
    }
    this.cart = null;
    this.order = null;
    return this.getCurrentCart(auth);
  }

  getCurrentCart(auth) {
    var cart = localStorage.getItem('cart');

    if (auth.headers.Authorization === 'Bearer undefined') {
      /**
       * For guest users, their cart is maintained in local storage.
       *
       * We only need to make an API call for a guest user that doesn't yet
       * have a cart cookie in local storage. This API call detects that the
       * user is a guest and just sends back a new cart object, without saving
       * to the DB.
       */
      if (!cart) {
        return axios.get(API_GET_CURRENT_CART).then((res) => {
          localStorage.setItem('cart', JSON.stringify(res.data));
        });
      } else {
        this.cart = cart;
      }
    } else {
      // TODO: If guest customer has cart open in their browser, then signs up for acct,
      // We need to persist their cart to the DB and remove it from local storage.
      // if (cart) localStorage.removeItem('cart');

      // If the store is already observing the user's cart, send oid in the req
      let url = API_GET_CURRENT_CART;
      if (this.cart && this.cart._id) url += '/' + this.cart._id;

      return axios.get(url, auth).then((res) => {
        this.cart = res.data;
      });
    }
  }

  async editCurrentCart(data, auth, order_summary, delivery) {
    let cart_id;
    if (this.cart) {
      cart_id = this.cart._id;
    }
    if (order_summary) {
      cart_id = this.order.cart_id;
    }

    let url = API_EDIT_CURRENT_CART;
    if (cart_id) url += cart_id;

    let res;
    if (auth.headers.Authorization === 'Bearer undefined') {
      res = await axios.patch(url, data);
    } else {
      res = await axios.patch(url, data, auth);
    }
    this.cart = res.data;
    if (order_summary) {
      this.getOrderSummary(auth);
    }
  }

  async updateCartItems(delivery) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const res = await axios.patch(
      `${API_GET_CURRENT_CART}/items?time=${currentTime}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
      { cart_id: this.cart._id },
    );
    this.order = res.data;
    return res.data;
  }

  async getOrderSummary(auth) {
    const res = await axios.get(API_GET_ORDER_SUMMARY, auth);
    this.order = res.data;
    return res.data;
  }

  async getDeliveryTimes(auth) {
    let zip = localStorage.getItem('zip');
    const res = await axios.get(
      `${API_DELIVERY_TIMES}?user_time=${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}&zip=${zip}`,
      auth,
    );
    this.transformDeliveryTimes(res.data);
    return res.data;
  }

  transformDeliveryTimes(data) {
    if (!data) return;

    this.deliveryTimes = [];
    const times = data.delivery_windows;
    for (var i = 0, len = times.length; i < len; i++) {
      this.addTimes(times[i]);
    }
  }

  addTimes(data) {
    const timeFirst = data[0].split('-')[0];
    const toProvide = data[1] + ' ' + timeFirst;
    const day = moment(toProvide, 'YYYY-MM-DD h:mm').calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD/MM/YYYY',
    });

    const findTime = this.deliveryTimes.findIndex((data) => data.day === day);

    const obj = {
      time: data[0],
      date: data[1],
      availability: data[2],
    };

    if (findTime === -1) {
      this.deliveryTimes.push({ day: day, data: [obj] });
    } else {
      this.deliveryTimes[findTime].data.push(obj);
    }
  }
}

decorate(CheckoutStore, {
  cart: observable,
  order: observable,
  deliveryTimes: observable,

  getDeliveryTimes: action,
  getCurrentCart: action,
  editCurrentCart: action,
  getOrderSummary: action,
});

export default new CheckoutStore();
