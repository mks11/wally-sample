import {observable, decorate, action} from 'mobx'
import {
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_LOCATIONS,
  API_ADMIN_GET_SHOP_ITEMS,
  API_ADMIN_GET_SHOP_ITEMS_FARMS,
  API_ADMIN_GET_UNAVAILABLE_SHOP_ITEMS,
  API_ADMIN_GET_SUB_INFO,
  API_ADMIN_UPDATE_DAILY_SUBSTITUTE,
  API_ADMIN_UPDATE_SHOP_ITEM,
  API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS,
  API_ADMIN_SET_SHOP_ITEM_STATUS,
  API_ADMIN_GET_LOCATION_STATUS,
  API_ADMIN_GET_SHOPPER_PACKAGING_INFO,
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
  locationStatus = {}
  packagingCounts = {}
  availableSubs = []
  dailySubstitute = {}

  routes = []
  orders = []
  singleorder = {}

  packagings = []

  loading = false
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

  async getUnavailableShopItems(timeframe, shop_location) {
    const res = await axios.get(`${API_ADMIN_GET_UNAVAILABLE_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`)
    this.shopitems = res.data.shop_items
  }
  
  async getSubInfo(shopitem_id, delivery_date, location) {
    const res = await axios.get(`${API_ADMIN_GET_SUB_INFO}/${shopitem_id}?delivery_date=${delivery_date}?location={location}`)
    this.availableSubs = res.data.available_substitutes
  }

  async updateDailySubstitute(delivery_date, shopitem_id, data) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_DAILY_SUBSTITUTE}/${shopitem_id}?delivery_date=${delivery_date}`, data)
    // unsure if response data will be in res.data or res.data.daily_substitute
    this.dailySubstitute = res.data
  }

  async getLocationStatus(timeframe) {
    const res = await axios.get(`${API_ADMIN_GET_LOCATION_STATUS}?timeframe=${timeframe}`)
    this.locationStatus = res.data.location_status
  }

  async getShopperPackagingInfo(timeframe, shop_location) {
    const res = await axios.get(`${API_ADMIN_GET_SHOPPER_PACKAGING_INFO}?timeframe=${timeframe}&shop_location=${shop_location}`)

    this.packagingCounts = res.data.packaging_counts
  }

  async updateShopItem(timeframe, shopitem_id, data, updateCurrentProduct, index) {
    this.loading = true
    const res = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}?timeframe=${timeframe}`, data)
    this.loading = false
    if (res.data.shopItem) updateCurrentProduct(res.data.shopItem, index)
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

  async setShopItemStatus(status, shopitem_id) {
    const res = await axios.patch(`${API_ADMIN_SET_SHOP_ITEM_STATUS}/${shopitem_id}?status=${status}`)
    this.updateStoreShopItem(shopitem_id, res.data)
  }

  async getRoutes(timeframe, options) {
    this.routes = []
    const res = await axios.get(`${API_ADMIN_GET_ROUTES}?timeframe=${timeframe}`, options)
    this.orders = []
    this.routes = res.data
  }

  async getRouteOrders(id, timeframe, options) {
    const res = await axios.get(`${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/orders?route_id=${id}&timeframe=${timeframe ? timeframe : ''}`, options)
    this.orders = res.data
  }

  async updateRoutePlacement(id, data, options) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/${id}/placement`, data, options)
    this.updateRouteItem(id, res.data)
  }

  async getOrder(id, options) {
    this.singleorder = {}
    const res = await axios.get(`${API_ADMIN_GET_ORDER}/${id}`, options)
    this.singleorder = res.data
  }

  async getPackagings() {
    this.packagings = []
    const res = await axios.get(`${API_ADMIN_GET_PACKAGINGS}`)
    this.packagings = res.data
  }

  async packageOrder(id, data, options) {
    const res = await axios.patch(`${API_ADMIN_PACKAGE_ORDER}/${id}/package`, data, options) // API_CREATE_ORDER
    console.log(res.data);
    this.updateOrderItem(id, res.data)
  }

  async completeOrder(id, data, options) {
    const res = await axios.patch(`${API_ADMIN_COMPLETE_ORDER}/${id}/complete`, data, options) // API_CREATE_ORDER
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
      if (item._id === id) {
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
      if (item._id === id) {
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
  locationStatus: observable,
  packagingCounts: observable,
  availableSubstitutes: observable,
  routes: observable,
  orders: observable,
  singleorder: observable,
  packagings: observable,
  blogposts: observable,

  getTimeFrames: action,
  getShopLocations: action,
  getShopItems: action,
  getShopItemsFarms: action,
  getUnavailableShopItems: action,
  getSubInfo: action,
  updateDailySubstitute: action,
  updateShopItem: action,
  updateShopItemsWarehouseLocations: action,
  setShopItemStatus: action,
  getLocationStatus: action,
  getShopperPackagingInfo: action,
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
