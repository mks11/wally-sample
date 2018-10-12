import {observable, decorate, action } from 'mobx'
import { 
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_LOCATIONS,
} from '../config'
import axios from 'axios'

class AdminStore {

  timeFrames = {}
  locations = {}

  async getTimeFrames(time){
    const resp = await axios(`${API_ADMIN_GET_TIME_FRAMES}/${time}`)
    this.timeFrames = resp.data
  }

  async getShopLocations(){
    const resp = await axios(API_ADMIN_GET_SHOP_LOCATIONS)
    this.locations = resp.data
  }
}

decorate(AdminStore, {
  timeFrames: observable,
  locations: observable,
  getTimeFrames: action,
  getShopLocations: action,
})

export default new AdminStore()
