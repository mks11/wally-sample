import { observable, decorate, action, runInAction } from "mobx";
import {
  API_GET_ORDERS,
  API_SUBMIT_ISSUE,
  API_SUBMIT_FEEDBACK,
  API_SUBMIT_SERVICE_FEEDBACK,
} from "../config";
import axios from "axios";
import moment from "moment";

class OrderStore {
  orders = [];
  reportModal = false;
  reportSuccessModal = false;
  activeOrder = null;

  async getOrders(auth) {
    return axios.get(API_GET_ORDERS, auth).then((res) =>
      runInAction(() => {
        this.orders = res.data;
      })
    );
  }

  toggleReport(order) {
    this.reportModal = !this.reportModal;
    if (this.reportModal) {
      this.activeOrder = order;
    }
  }

  toggleReportSuccess() {
    this.reportSuccessModal = !this.reportSuccessModal;
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
  reportModal: observable,
  reportSuccessModal: observable,
  getOrders: action,
  toggleReport: action,
  toggleReportSuccess: action,
});

export default new OrderStore();
