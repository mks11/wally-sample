import {observable, decorate, action} from 'mobx'
import { 
  API_GET_PRODUCT_DETAIL, API_GET_ADVERTISEMENTS, 
  API_GET_PRODUCT_DISPLAYED, API_GET_CATEGORIES, API_SEARCH_KEYWORD } from '../config'
import axios from 'axios'

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

    const res = await axios.get(API_GET_PRODUCT_DETAIL + product_id)
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

  async getProductDisplayed(id) {
    this.fetch = true
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED
    const res = await axios.get(url)
    const data = res.data
    this.main_display = data.main_products
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
    const res = await axios.get(API_SEARCH_KEYWORD + keyword)
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
