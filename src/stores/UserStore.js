import { observable, decorate, action, computed, runInAction } from 'mobx';

// API
import { deleteAddress } from 'api/address';
import { deactivatePaymentMethod } from 'api/payment';
import {
  API_LOGIN,
  API_LOGIN_FACEBOOK,
  API_GET_LOGIN_STATUS,
  API_GET_USER,
  API_SIGNUP,
  API_EDIT_USER,
  API_ADDRESS_NEW,
  API_PAYMENT_REMOVE,
  API_REFER_FRIEND,
  API_SUBSCRIBE_EMAIL,
  API_FORGOT_PASSWORD,
  API_PURCHASE_GIFTCARD,
} from '../config';

import axios from 'axios';
import moment from 'moment';

const TYPES = ['admin', 'ops_lead', 'user', 'ops', 'retail'];

class UserStore {
  user = null;
  status = false;
  token = '';

  selectedDeliveryAddress = null;
  selectedPaymentMethod = null;
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

  async makeDefaultAddress(address_id) {
    const res = await axios.patch(
      API_EDIT_USER,
      { preferred_address: address_id },
      this.getHeaderAuth(),
    );
    return res.data;
  }

  async saveAddress(data) {
    const res = await axios.post(API_ADDRESS_NEW, data, this.getHeaderAuth());
    this.updateSelectedDeliveryAddress(res.data);
    this.setUserData(res.data);
    return res.data;
  }

  async deletePayment(payment_id) {
    const res = await axios.delete(
      API_PAYMENT_REMOVE + payment_id,
      this.getHeaderAuth(),
    );
    return res.data;
  }

  updateSelectedDeliveryAddress(newUser) {
    const oldAddresses = this.user.addresses;
    const newAddresses = newUser.addresses;

    function comparer(otherArray) {
      return function (current) {
        return (
          otherArray.filter(function (other) {
            return other.address_id === current.address_id;
          }).length === 0
        );
      };
    }

    let addressOldFilter = oldAddresses.filter(comparer(newAddresses));
    let addressNewFilter = newAddresses.filter(comparer(oldAddresses));

    let diff = addressOldFilter.concat(addressNewFilter);
    this.selectedDeliveryAddress = diff[0];
    localStorage.setItem(
      'zip',
      JSON.stringify(this.selectedDeliveryAddress.zip),
    );
  }

  readStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    // const delivery = localStorage.getItem('delivery');
    const flags = localStorage.getItem('flags');

    runInAction(() => {
      if (token && user) {
        this.token = JSON.parse(token);
        this.user = JSON.parse(user);
      }

      // if (delivery) {
      //   const deliveryData = JSON.parse(delivery);
      //   this.selectedDeliveryAddress = deliveryData.address;
      //   this.selectedDeliveryTime = deliveryData.time;
      // }

      this.flags = flags && JSON.parse(flags);
    });
  }

  setDeliveryData() {
    const data = {
      address: this.selectedDeliveryAddress,
      time: this.selectedDeliveryTime,
    };
    if (data.address)
      localStorage.setItem('zip', JSON.stringify(data.address.zip));

    // localStorage.setItem('delivery', JSON.stringify(data));
  }

  async getUser() {
    const res = await axios.get(API_GET_USER, this.getHeaderAuth());
    this.setUserData(res.data);
    //this.setUserToken(res.data.token)
    return res.data;
  }

  deleteAddress(address_id) {
    const auth = this.getHeaderAuth();

    // Reset the selected address if it matches the address being deleted.
    if (
      this.selectedDeliveryAddress &&
      this.selectedDeliveryAddress.address_id &&
      this.selectedDeliveryAddress.address_id === address_id
    ) {
      this.selectedDeliveryAddress = null;
    }

    return deleteAddress(address_id, auth).then(() => {
      this.getUser();
    });
  }

  async saveLocalAddresses() {
    let addresses = [];
    if (localStorage.getItem('addresses')) {
      addresses = JSON.parse(localStorage.getItem('addresses'));
    }

    for (const address of addresses) {
      const user = await this.saveAddress(address, this.getHeaderAuth());
      if (address.address_id === this.selectedDeliveryAddress.address_id) {
        const added = user.addresses[user.addresses.length - 1];
        this.setDeliveryAddress(added);
      }
    }

    localStorage.removeItem('addresses');
  }

  async getStatus(update) {
    runInAction(() => (this.isAuthenticating = true));
    this.readStorage();

    runInAction(() => {
      if (!this.token && !this.token.accessToken) {
        this.status = false;
        return this.status;
      }
    });

    this.saveLocalAddresses();

    try {
      const resp = await axios.get(API_GET_LOGIN_STATUS, this.getHeaderAuth());
      let status = resp.data.status && localStorage.getItem('user');

      runInAction(() => {
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
      });

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
    this.selectedDeliveryAddress = null;
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

  async purchaseGiftCard(data) {
    const auth = this.getHeaderAuth();
    const options =
      auth.headers.Authorization === 'Bearer undefined' ? {} : auth;
    const res = await axios.post(API_PURCHASE_GIFTCARD, data, options);
    return res.data;
  }

  async resetPassword(token, data) {
    const res = await axios.patch(API_FORGOT_PASSWORD + '/' + token, data);
    return res.data;
  }

  getAddressById(id) {
    return this.user
      ? this.user.addresses.find((item) => item.address_id === id)
      : null;
  }

  setDeliveryAddress(data) {
    this.selectedDeliveryAddress = data;
    // localStorage.setItem('zip', data.zip);
    // this.setDeliveryData();
  }

  setDeliveryTime(time) {
    this.selectedDeliveryTime = time;
    this.setDeliveryData();
  }

  getPaymentMethodById(id) {
    return this.user ? this.user.payment.find((item) => item._id === id) : null;
  }

  setPaymentMethod(data) {
    this.selectedPaymentMethod = data;
  }

  deactivatePaymentMethod(paymentId) {
    const auth = this.getHeaderAuth();

    // Reset the selected address if it matches the address being deleted.
    if (
      this.selectedPaymentMethod &&
      this.selectedPaymentMethod._id &&
      this.selectedPaymentMethod._id === paymentId
    ) {
      this.selectedPaymentMethod = null;
    }

    return deactivatePaymentMethod(paymentId, auth).then(() => {
      this.getUser();
    });
  }

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

  loadFakeUser() {
    let addresses = [];
    if (localStorage.getItem('addresses')) {
      addresses = JSON.parse(localStorage.getItem('addresses'));
    }
    const user = {
      addresses,
      preferred_address: null,
    };

    return user;
  }

  async subscribeNewsletter(email) {
    const res = await axios.post(API_SUBSCRIBE_EMAIL, { email });
    return res.data;
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
  selectedPaymentMethod: observable,
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

  deleteAddress: action,
  saveAddress: action,
  makeDefaultAddress: action,

  deletePayment: action,

  getHeaderAuth: action,
  forgotPassword: action,
  resetPassword: action,

  setDeliveryAddress: action,
  setPaymentMethod: action,
  deactivatePaymentMethod: action,
  setDeliveryTime: action,
  loadFakeUser: action,
  adjustDeliveryTimes: action,

  getAddressById: action,
  updateFlags: action,
});

export default new UserStore();
