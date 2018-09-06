import {observable, decorate, action} from 'mobx'
import { 
  API_LOGIN, API_LOGIN_FACEBOOK, API_GET_LOGIN_STATUS, API_GET_USER, API_SIGNUP, API_EDIT_USER,
  API_ADDRESS_NEW, API_ADDRESS_EDIT, API_ADDRESS_REMOVE,
  API_PAYMENT_NEW, API_PAYMENT_EDIT, API_PAYMENT_REMOVE,
  API_REFER_FRIEND,
  API_FORGOT_PASSWORD, API_RESET_PASSWORD
} from '../config'
import axios from 'axios'

let index = 0

class UserStore {
  user = null
  status = false
  token = ''

  // for account page
  addressModal = false
  addressModalOpen = false
  activeAddress = null

  paymentModal = false
  paymentModalOpen = false
  activePayment = null
  refUrl = ''

  setUserData(user) {
    console.log(user)
    this.user = user
    localStorage.setItem('user', JSON.stringify(this.user))
  }

  setToken(token) {
    this.token = token
    this.status = true
    localStorage.setItem('token', JSON.stringify(this.token))
  }


  async login(email, password) {
    const resp =  await axios.post(API_LOGIN, {
      email, password
    })

    this.setUserData(resp.data.user)
    this.setToken(resp.data.token)

  }

  async signup(data) {
    const res = await axios.post(API_SIGNUP, data)
    return res.data
  }

  async edit(data) {
    const res = await axios.patch(API_EDIT_USER, data, this.getHeaderAuth())
    return res.data
  }

  showAddressModal(data) {
    this.activeAddress = data
    this.addressModal = true
    this.addressModalOpen = true
  }

  hideAddressModal() {
    this.activeAddress = null
    this.addressModal = false
  }

  closeAddressModal() {
    this.addressModalOpen = false
  }

  showPaymentModal(data) {
    this.activePayment = data
    this.paymentModal = true
    this.paymentModalOpen = true
  }

  hidePaymentModal() {
    this.activePayment = null
    this.paymentModal = false
  }

  closePaymentModal() {
    this.paymentModalOpen = false
  }

  getHeaderAuth() {
    const options = {
      headers: {'Authorization': 'Bearer ' + this.token.accessToken}
    }

    return options
  }

  async referFriend() {
    const res = await axios.get(API_REFER_FRIEND, this.getHeaderAuth())
    this.refUrl = res.data.ref_url
    return res
  }
  
  async makeDefaultAddress(address_id) {
    const res = await axios.patch(API_ADDRESS_EDIT, {address_id}, this.getHeaderAuth())
    return res.data
  }

  async deleteAddress(address_id) {
    const res = await axios.delete(API_ADDRESS_REMOVE +  address_id, this.getHeaderAuth())
    return res.data
  }

  async saveAddress(data) {
    const res = await axios.post(API_ADDRESS_NEW, data, this.getHeaderAuth())
    return res.data
  }


  async makeDefaultPayment(id) {
    const res = await axios.post(API_PAYMENT_EDIT, {id}, this.getHeaderAuth())
    return res.data
  }

  async deletePayment(payment_id) {
    const res = await axios.delete(API_PAYMENT_REMOVE + payment_id, this.getHeaderAuth())
    return res.data
  }

  async savePayment(data) {
    const res = await axios.post(API_PAYMENT_NEW, data, this.getHeaderAuth())
    return res.data
  }

  readStorage() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      this.token = JSON.parse(token)
      this.user = JSON.parse(user)
    }
  }

  async getUser() {
    const res = await axios.get(API_GET_USER, this.getHeaderAuth())
    this.setUserData(res.data)
    //this.setUserToken(res.data.token)
    return res.data
  }


  async getStatus() {
    this.readStorage()
    if (!this.token && !this.token.accessToken) {
      this.status = false
      return status
    }

    const resp = await axios.get(API_GET_LOGIN_STATUS, this.getHeaderAuth())
    let status = resp.data.status && localStorage.getItem('user')
    if (resp.data.status && localStorage.getItem('user')) {
      this.status = true
      // const respGetUser = await axios.get(API_GET_USER, this.getHeaderAuth())
      this.user = JSON.parse(localStorage.getItem('user'))
    } else {
      status = false
      this.status = false
      this.user = null
    }
    return status
  }

  logout() {
    localStorage.removeItem('user')
    this.status = false
    this.user = null
  }

  async loginFacebook(data) {
    const res = await axios.post(API_LOGIN_FACEBOOK, {access_token: data.accessToken})
    this.setUserData(res.data.user)
    this.setToken(res.data.token)
    return res.data
  }

  async forgotPassword(email) {
    const res = await axios.post(API_FORGOT_PASSWORD, {email})
    return res.data
  }

  async resetPassword(email) {
    const res = await axios.post(API_FORGOT_PASSWORD, {email})
    return res.data
  }
}


decorate(UserStore, {
  user: observable,
  status: observable,
  token: observable,
  addressModal: observable,
  addressModalOpen: observable,
  activeAddress: observable,

  paymentModal: observable,
  paymentModalOpen: observable,
  activePayment: observable,

  refUrl: observable,

  login: action,
  getUser: action,
  loginFacebook: action,
  setUserData: action,
  setToken: action,
  edit: action,
  signup: action,
  logout: action,
  getStatus: action,
  showAddressModal: action,
  hideAddressModal: action,
  closeAddressModal: action,

  showPaymentModal: action,
  hidePaymentModal: action,
  closePaymentModal: action,

  referFriend: action,

  deleteAddress: action,
  saveAddress: action,
  makeDefaultAddress: action,

  deletePayment: action,
  savePayment: action,
  makeDefaultPayment: action,

  getHeaderAuth: action,
  forgotPassword: action,
  resetPassword: action,

})


export default new UserStore()
