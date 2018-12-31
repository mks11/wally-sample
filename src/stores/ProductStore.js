import {observable, decorate, action} from 'mobx'
import { 
  API_GET_PRODUCT_DETAIL, API_GET_ADVERTISEMENTS, 
  API_GET_PRODUCT_DISPLAYED, API_GET_CATEGORIES, API_SEARCH_KEYWORD } from '../config'
import axios from 'axios'
import moment from 'moment'

class ProductStore {
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

  async showModal(product_id, customer_quantity, delivery) {
    this.activeProductId = product_id

    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(`${API_GET_PRODUCT_DETAIL}${product_id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    this.activeProduct = res.data
    if (this.activeProduct.available_inventory.length === 0) {
      alert('Item not available in inventory')
      return
    }
    const inventory = this.activeProduct.available_inventory[0]
    var min_size = 1
    if (inventory.price_unit == "lb" || inventory.price_unit == "oz") min_size = 0.25

    this.customer_quantity = customer_quantity ? customer_quantity : min_size
    return res.data
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

  async getProductDisplayed(id, delivery) {
    this.fetch = true
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED
    const res = await axios.get(`${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    const data = res.data

    this.main_display = data.main_products
    this.path = data.path
    this.sidebar = data.sidebar
    this.fetch = false

    return res.data
  }

  getCategories() {
    axios.get(API_GET_CATEGORIES)
      .then(resp => {
        const data = resp.data
        this.categories = data
      }).catch((e) => console.error('Failed to load categories: ', e))
  }

  async searchKeyword(keyword, delivery) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(`${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    return res.data
  }
}

decorate(ProductStore, {
  main_display: observable,
  path: observable,
  sidebar: observable,
  customer_quantity: observable,
  fetch: observable,
  categories: observable,
  activeProduct: observable,
  activeProductId: observable,
  showModal: action,
  getAdvertisements: action,
  getProductDisplayed: action,
  getCategories: action,
  searchKeyword: action,
})


export default new ProductStore()
