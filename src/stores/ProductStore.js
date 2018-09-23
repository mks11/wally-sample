import {observable, decorate, action} from 'mobx'
import { 
  API_GET_PRODUCT_DETAIL, API_GET_ADVERTISEMENTS, 
  API_GET_PRODUCT_DISPLAYED, API_GET_CATEGORIES, API_SEARCH_KEYWORD } from '../config'
import axios from 'axios'
import moment from 'moment'

let index = 0

class ProductStore {
  // modal state open
  open = false
  modal = false

  main_display = []
  path = []
  sidebar = []
  activeProductId = null
  activeProduct = null
  categories = []
  fetch = false

  customer_quantity = null


  ads1 = null
  ads2 = null

  async showModal(product_id, customer_quantity) {
    this.activeProductId = product_id

    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(API_GET_PRODUCT_DETAIL + product_id + '?time=' + time)
    this.activeProduct = res.data
    this.customer_quantity = customer_quantity ? customer_quantity : this.activeProduct.min_size
    this.open = true
    this.modal = true
  }

  getAdvertisements() {
    axios.get(API_GET_ADVERTISEMENTS)
      .then((resp) => {
        this.ads1 = resp.data.ads1
        this.ads2 = resp.data.ads2
      }).catch((e) => {
        console.error('Failed to load advertisement', e)
      })
  }

  limitDisplay(data)  {
    const display = []
    for (let i = 0; i < 4; i++) {
      display.push(data[i])
    }
    
    return display
  }

  async getProductDisplayed(id) {
    this.fetch = true
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED
    const res = await axios.get(url + '?time='+time)
    const data = res.data

    let mode = 'all'
    if (!id || id.length <= 3) {
      mode = 'limit'
    }

    this.main_display = data.main_products
    console.log('mode', mode)
    if (mode === 'limit') {
      for (const i in this.main_display) {

      console.log('masuk dek', this.main_display[i].products)
        this.main_display[i].products = this.limitDisplay(this.main_display[i].products) 
      console.log('masuk dek changed', this.main_display[i].products)
      }
    }

    this.path = data.path
    this.sidebar = data.sidebar
    this.fetch = false

    return res
  }

  getCategories() {
    axios.get(API_GET_CATEGORIES)
      .then(resp => {
        const data = resp.data
        this.categories = data
      }).catch((e) => console.error('Failed to load categories: ', e))
  }

  async searchKeyword(keyword) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(API_SEARCH_KEYWORD + '?keyword='+ keyword + '&time=' + time)
    return res.data
  }

  hideModal() {
    this.modal = false
  }

  closeModal() {
    this.open = false
  }

}

decorate(ProductStore, {
  open: observable,
  modal: observable,
  main_display: observable,
  path: observable,
  sidebar: observable,
  customer_quantity: observable,
  fetch: observable,
  categories: observable,
  activeProduct: observable,
  activeProductId: observable,
  showModal: action,
  hideModal: action,
  closeModal: action,
  getAdvertisements: action,
  getProductDisplayed: action,
  getCategories: action,
  searchKeyword: action,
})


export default new ProductStore()
