import { observable, decorate, action } from 'mobx'
import { 
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_LOCATIONS,
} from '../config'
import axios from 'axios'
import moment from 'moment'

class AdminStore {

  timeframes = []
  locations = []

  async getTimeFrames(){
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const resp = await axios(`${API_ADMIN_GET_TIME_FRAMES}?time=${time}`)
    this.timeframes = resp.data.timeframes
  }

  async getShopLocations(timeframe){
    const resp = await axios(`${API_ADMIN_GET_SHOP_LOCATIONS}?timeframe=${timeframe}`)
    this.locations = resp.data.locations
  }
}

decorate(AdminStore, {
  timeframes: observable,
  locations: observable,
  getTimeFrames: action,
  getShopLocations: action,
})

export default new AdminStore()
