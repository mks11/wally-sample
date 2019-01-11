import {observable, decorate, action} from 'mobx'
import {
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_LOCATIONS,
  API_ADMIN_GET_SHOP_ITEMS,
  API_ADMIN_GET_SHOP_ITEMS_FARMS,
  API_ADMIN_UPDATE_SHOP_ITEM,
  API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS,
  API_ADMIN_GET_ROUTES,
  API_ADMIN_UPDATE_ROUTE_PLACEMENT,
  API_ADMIN_GET_ORDER,
  API_ADMIN_GET_PACKAGINGS,
  API_ADMIN_PACKAGE_ORDER, // API_CREATE_ORDER
  API_ADMIN_COMPLETE_ORDER, // API_CREATE_ORDER
  API_ADMIN_POST_BLOG_POST,
} from '../config'
import axios from 'axios'
import moment from 'moment'

class AdminStore {
  timeframes = []
  locations = []

  shopitems = []
  shopitemsFarms = []

  routes = []
  orders = []
  singleorder = {}

  packagings = []

  async getTimeFrames() {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    // const time = '2018-11-04 15:30:00'
    const res = await axios.get(`${API_ADMIN_GET_TIME_FRAMES}?time=${time}`)
    this.timeframes = res.data.timeframes
  }

  async getShopLocations(timeframe) {
    const res = await axios.get(`${API_ADMIN_GET_SHOP_LOCATIONS}?timeframe=${timeframe}`)
    this.locations = res.data.locations
  }

  async getShopItems(timeframe, shop_location) {
    const res = await axios.get(`${API_ADMIN_GET_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`)
    this.shopitems = res.data.shop_items
  }

  async getShopItemsFarms(timeframe, shop_location) {
    const res = await axios.get(`${API_ADMIN_GET_SHOP_ITEMS_FARMS}?timeframe=${timeframe}&shop_location=${shop_location}`)
    this.shopitemsFarms = res.data.farms
  }

  async updateShopItem(timeframe, shopitem_id, data) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}?timeframe=${timeframe}`, data)
    this.updateStoreShopItem(shopitem_id, res.data)
  }

  async updateShopItemQuantity(timeframe, shopitem_id, data) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}/quantity?timeframe=${timeframe}`, data)
    this.updateStoreShopItem(shopitem_id, res.data)
  }

  async updateShopItemsWarehouseLocations(data) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS}`, data)
    this.updateManyStoreShopItems(res.data)
  }

  async getRoutes(timeframe, options) {
    this.routes = []
    const res = await axios.get(`${API_ADMIN_GET_ROUTES}?timeframe=${timeframe}`, options)
    this.routes = res.data
  }

  async getRouteOrders(id, timeframe, options) {
    const res = await axios.get(`${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/orders?route_id=${id}&timeframe=${timeframe ? timeframe : ''}`, options)
    this.orders = res.data[0]
  }

  async updateRoutePlacement(id, data, options) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/${id}/placement`, data, options)
    this.updateRouteItem(id, res.data)
  }

  async getOrder(id, options) {
    const res = await axios.get(`${API_ADMIN_GET_ORDER}/${id}`, options)
    this.singleorder = res.data
  }

  async getPackagings() {
    const res = await axios.get(`${API_ADMIN_GET_PACKAGINGS}`)
    this.packagings = res.data
  }

  async packageOrder(id, data) {
    const res = await axios.patch(`${API_ADMIN_PACKAGE_ORDER}/${id}/package`, data) // API_CREATE_ORDER
    this.updateOrderItem(id, res.data)
  }

  async completeOrder(id, data) {
    const res = await axios.patch(`${API_ADMIN_COMPLETE_ORDER}/${id}/complete`, data) // API_CREATE_ORDER
    this.updateOrderItem(id, res.data)
  }

  async postBlogPost(data) {
    const res = await axios.post(API_ADMIN_POST_BLOG_POST, data)
    console.log(res.data)
  }

  setEditing(id, edit) {
    for (let item of this.shopitems) {
      if (item.product_id === id) {
        item.complete = !edit
        break
      }
    }
  }

  updateStoreShopItem(id, updateditem) {
    this.shopitems = this.shopitems.map(item => {
      if (item.product_id === id) {
        item = updateditem
      }
      return item
    })
  }

  updateRouteItem(id, updateditem) {
    this.routes = this.routes.map(item => {
      if (item.id === id) {
        item = updateditem
      }
      return item
    })
  }

  updateOrderItem(id, updateditem) {
    this.orders = this.orders.map(item => {
      if (item.id === id) {
        item = updateditem
      }
      return item
    })
  }

  updateManyStoreShopItems(shopitems) {
    for (let item of shopitems) {
      const id = item.product_id
      this.updateStoreShopItem(id, item)
    }
  }
}

decorate(AdminStore, {
  timeframes: observable,
  locations: observable,
  shopitems: observable,
  shopitemsFarms: observable,
  routes: observable,
  orders: observable,
  singleorder: observable,
  packagings: observable,
  blogposts: observable,

  getTimeFrames: action,
  getShopLocations: action,
  getShopItems: action,
  getShopItemsFarms: action,
  updateShopItemsWarehouseLocations: action,
  getRoutes: action,
  getRouteOrders: action,
  updateRoutePlacement: action,
  getOrder: action,
  getPackagings: action,
  packageOrder: action,
  completeOrder: action,
  postBlogPost: action,
})

export default new AdminStore()
