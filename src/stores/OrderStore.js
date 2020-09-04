import { observable, decorate, action, runInAction } from 'mobx';
import {
  API_GET_ORDERS,
  API_SUBMIT_ISSUE,
  API_SUBMIT_FEEDBACK,
  API_SUBMIT_SERVICE_FEEDBACK,
} from '../config';
import axios from 'axios';
import moment from 'moment';

class OrderStore {
  orders = [];
  activeOrder = null;

  async getOrders(auth) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const res = await axios.get(API_GET_ORDERS + '?time=' + time, auth);
    this.orders = res.data;
  }

  async submitIssue(data, auth) {
    const res = await axios.post(API_SUBMIT_ISSUE, data, auth);
    return res;
  }

  async submitFeedback(data) {
    const res = await axios.post(API_SUBMIT_FEEDBACK, data);
    return res;
  }

  async submitServiceFeedback(data) {
    const res = await axios.post(API_SUBMIT_SERVICE_FEEDBACK, data);
    return res;
  }
}

decorate(OrderStore, {
  orders: observable,
  activeOrder: observable,
  getOrders: action,
});

export default new OrderStore();
