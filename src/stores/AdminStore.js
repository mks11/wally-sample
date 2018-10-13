import { observable, decorate, action } from 'mobx'
import { 
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_LOCATIONS,
  API_ADMIN_GET_SHOP_ITEMS,
  API_ADMIN_GET_SHOP_ITEMS_FARMS,
  API_ADMIN_UPDATE_SHOP_ITEM,
  API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS,
} from '../config'
import axios from 'axios'
import moment from 'moment'

class AdminStore {
  timeframes = []
  locations = []
  shopitems = []
  shopitemsFarms = {}

  async getTimeFrames() {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const resp = await axios.get(`${API_ADMIN_GET_TIME_FRAMES}?time=${time}`)
    this.timeframes = resp.data.timeframes
  }

  async getShopLocations(timeframe) {
    const resp = await axios.get(`${API_ADMIN_GET_SHOP_LOCATIONS}?timeframe=${timeframe}`)
    this.locations = resp.data.locations
  }

  async getShopItems(timeframe, shop_location) {
    const resp = await axios.get(`${API_ADMIN_GET_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`)
    this.shopitems = resp.data.shop_items
  }

  async getShopItemsFarms(timeframe, shop_location) {
    const resp = await axios.get(`${API_ADMIN_GET_SHOP_ITEMS_FARMS}?timeframe=${timeframe}&shop_location=${shop_location}`)
    this.shopitemsFarms = resp.data.farms
  }

  async updateShopItem(timeframe, shopitem_id, data) {
    const resp = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}?timeframe=${timeframe}`, data)
    this.updateStoreShopItem(shopitem_id, resp.data)
  }

  async updateShopItemQuantity(timeframe, shopitem_id) {
    const data = {}
    const resp = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}/quantity?timeframe=${timeframe}`, data)
    console.log(resp.data)
    //this.updateStoreShopItem(shopitem_id, resp.data)
  }

  async updateShopItemsWarehouseLocations(data) {
    const resp = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS}`, data)
    console.log(resp.data)
    // updateManyStoreShopItems(resp.data)
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

  getTimeFrames: action,
  getShopLocations: action,
  getShopItems: action,
  getShopItemsFarms: action,
  updateShopItemsWarehouseLocations: action,
})

export default new AdminStore()
