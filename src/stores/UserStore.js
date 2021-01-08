import { observable, decorate, action, computed, runInAction } from 'mobx';

// API
import { updateAddressAPI, deleteAddress } from 'api/address';
import {
  API_LOGIN,
  API_LOGIN_FACEBOOK,
  API_GET_LOGIN_STATUS,
  API_GET_USER,
  API_SIGNUP,
  API_EDIT_USER,
  API_PAYMENT_REMOVE,
  API_REFER_FRIEND,
  API_FORGOT_PASSWORD,
} from '../config';

import axios from 'axios';
import moment from 'moment';

const TYPES = ['admin', 'ops_lead', 'user', 'ops', 'retail'];

class UserStore {
  user = null;
  status = false;
  token = '';

  selectedDeliveryAddress = null;
  selectedDeliveryTime = null;

  refPromo = null;
  giftCardPromo = null;

  refUrl = '';

  cameFromCartUrl = false;
  feedback = null;

  flags = null;

  isAuthenticating = true;

  get isAdmin() {
    if (this.user) {
      return this.user.type === TYPES[0];
    }
    return false;
  }

  get isOpsLead() {
    if (this.user) {
      return this.user.type === TYPES[1];
    }
    return false;
  }

  get isUser() {
    if (this.user) {
      return this.user.type === TYPES[2];
    }
    return false;
  }

  get isOps() {
    if (this.user) {
      return this.user.type === TYPES[3];
    }
    return false;
  }

  get isRetail() {
    if (this.user) {
      return this.user.type === TYPES[4];
    }
    return false;
  }

  get isLoggedIn() {
    if (this.user) return true;
    return false;
  }

  get userId() {
    if (this.user) {
      return this.user._id;
    }
    return undefined;
  }

  setUserData(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(this.user));
    let zip = null;
    zip = localStorage.getItem('zip');
    if (!zip) {
      if (user.addresses.length > 0) {
        for (const address of user.addresses) {
          if (address.address_id === user.preferred_address) {
            localStorage.setItem('zip', JSON.stringify(address.zip));
          }
        }
      } else {
        if (user.signup_zip)
          localStorage.setItem('zip', JSON.stringify(user.signup_zip));
      }
    }
  }

  setToken(token) {
    this.token = token;
    this.status = true;
    localStorage.setItem('token', JSON.stringify(this.token));
  }

  async login(email, password) {
    const resp = await axios.post(API_LOGIN, {
      email,
      password,
    });

    this.setUserData(resp.data.user);
    this.setToken(resp.data.token);
  }

  async signup(data) {
    const res = await axios.post(API_SIGNUP, data);
    this.setUserData(res.data.user);
    this.setToken(res.data.token);
    return res.data;
  }

  async edit(data) {
    const res = await axios.patch(API_EDIT_USER, data, this.getHeaderAuth());
    return res.data;
  }

  getHeaderAuth() {
    return {
      headers: { Authorization: 'Bearer ' + this.token.accessToken },
    };
  }

  async referFriend() {
    const res = await axios.get(API_REFER_FRIEND, this.getHeaderAuth());
    this.refUrl = res.data.ref_url;
    return res;
  }

  async deletePayment(payment_id) {
    const res = await axios.delete(
      API_PAYMENT_REMOVE + payment_id,
      this.getHeaderAuth(),
    );
    return res.data;
  }

  readStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const flags = localStorage.getItem('flags');

    runInAction(() => {
      if (token && user) {
        this.token = JSON.parse(token);
        this.user = JSON.parse(user);
      }

      this.flags = flags && JSON.parse(flags);
    });
  }

  async getUser() {
    const res = await axios.get(API_GET_USER, this.getHeaderAuth());
    this.setUserData(res.data);
    //this.setUserToken(res.data.token)
    return res.data;
  }

  deleteAddress(address_id) {
    const auth = this.getHeaderAuth();
    return deleteAddress(address_id, auth).then(() => {
      this.getUser();
    });
  }

  async getStatus(update) {
    runInAction(() => (this.isAuthenticating = true));
    this.readStorage();

    if (!this.token && !this.token.accessToken) {
      this.status = false;
      return this.status;
    }

    try {
      const resp = await axios.get(API_GET_LOGIN_STATUS, this.getHeaderAuth());
      let status = resp.data.status && localStorage.getItem('user');

      if (resp.data.status && localStorage.getItem('user')) {
        this.status = true;
        // const respGetUser = await axios.get(API_GET_USER, this.getHeaderAuth())
        this.user = JSON.parse(localStorage.getItem('user'));
        if (update) {
          this.getUser();
        }
      } else {
        status = false;
        this.status = false;
        this.user = null;
        this.logout();
      }

      return status;
    } catch (e) {
      this.logout();
      console.error('Error getstatus: ', e);
      return false;
    } finally {
      runInAction(() => (this.isAuthenticating = false));
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('delivery');
    localStorage.removeItem('cart');
    localStorage.removeItem('zip');
    this.token = '';
    this.status = false;
    this.user = null;
    this.selectedDeliveryTime = null;
  }

  async loginFacebook(data) {
    const res = await axios.post(API_LOGIN_FACEBOOK, {
      access_token: data.accessToken,
      reference_promo: data.reference_promo,
    });
    this.setUserData(res.data.user);
    this.setToken(res.data.token);
    return res.data;
  }

  async forgotPassword(email) {
    const res = await axios.post(API_FORGOT_PASSWORD, { email });
    return res.data;
  }

  async resetPassword(token, data) {
    const res = await axios.patch(API_FORGOT_PASSWORD + '/' + token, data);
    return res.data;
  }

  // ================================ ADDRESSES ================================

  getAddressById(id) {
    return this.user
      ? this.user.addresses.find((item) => item.address_id === id)
      : null;
  }

  updateAddress(data) {
    const auth = this.getHeaderAuth();
    return updateAddressAPI(data, auth).then((res) => (this.user = res.data));
  }

  async makeDefaultAddress(address_id) {
    const res = await axios.patch(
      API_EDIT_USER,
      { preferred_address: address_id },
      this.getHeaderAuth(),
    );
    return res.data;
  }

  setDeliveryTime(time) {
    this.selectedDeliveryTime = time;
  }

  getPaymentMethodById(id) {
    return this.user ? this.user.payment.find((item) => item._id === id) : null;
  }

  // TODO: THIS ISN'T NEEDED ANYMORE. DECOUPLE FROM THE EDIT CART METHOD AND REMOVE
  getDeliveryParams() {
    let data = {
      zip: null,
      date: null,
    };

    if (this.selectedDeliveryAddress) {
      data.zip = this.selectedDeliveryAddress.zip;
    }

    if (this.selectedDeliveryTime) {
      data.date = this.selectedDeliveryTime.date;
    }

    return data;
  }

  async adjustDeliveryTimes(delivery_date, deliveryTimes) {
    if (delivery_date && deliveryTimes && this.selectedDeliveryTime) {
      const currentDate = this.selectedDeliveryTime.date;
      const date = moment.utc(delivery_date).format('YYYY-MM-DD');
      if (date !== currentDate) {
        const day = moment(date).calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'DD/MM/YYYY',
        });

        const deliveryDate = deliveryTimes.find((data) => data.day === day);
        if (deliveryDate) {
          let data = deliveryDate.data[0];

          data.day = day;

          this.setDeliveryTime(data);
        }
      }
    }
  }

  updateFlags(id, value) {
    const lsFlags = localStorage.getItem('flags');
    const flags = lsFlags ? JSON.parse(lsFlags) : {};

    flags[id] = value;
    this.flags = flags;

    localStorage.setItem('flags', JSON.stringify(flags));
  }
}

decorate(UserStore, {
  user: observable,
  status: observable,
  token: observable,
  getDeliveryParams: action,

  promoModal: observable,
  promoSuccessModal: observable,

  selectedDeliveryAddress: observable,
  selectedDeliveryTime: observable,

  refPromo: observable,
  giftCardPromo: observable,

  refUrl: observable,

  cameFromCartUrl: observable,
  feedback: observable,

  flags: observable,

  isAuthenticating: observable,
  isAdmin: computed,
  isOpsLead: computed,
  isOps: computed,
  isUser: computed,
  isRetail: computed,
  isLoggedIn: computed,

  login: action,
  getUser: action,
  loginFacebook: action,
  setUserData: action,
  setToken: action,
  edit: action,
  signup: action,
  logout: action,
  getStatus: action,

  referFriend: action,

  // ================================ ADDRESSES ================================

  deleteAddress: action,
  getAddressById: action,
  makeDefaultAddress: action,
  updateAddress: action,

  // ============================= PAYMENT METHODS =============================
  deletePayment: action,

  getHeaderAuth: action,
  forgotPassword: action,
  resetPassword: action,

  adjustDeliveryTimes: action,
  setDeliveryTime: action,

  updateFlags: action,
});

export default new UserStore();
