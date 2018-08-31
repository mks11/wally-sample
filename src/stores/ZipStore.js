import {observable, decorate, action} from 'mobx'
import { GET_ZIP_CODES,API_SUBSCRIBE_EMAIL } from '../config'
import axios from 'axios'

let index = 0

class ZipStore {
  zipcodes = []
  selectedZip = null

  async loadZipCodes() {
    const res = await axios.get(GET_ZIP_CODES)
    this.zipcodes = res.data.zipcodes
  }

  validateZipCode(zip) {
    const valid = this.zipcodes.find((z) => z == zip)
    if (valid) return true
    return false
  }

  async subscribe(data) {
    const res = await axios.post(API_SUBSCRIBE_EMAIL, data)
    return res.data
  }
}

decorate(ZipStore, {
  zipcodes: observable,
  selectedZip: observable,
  loadZipCodes: action,
  subsribe: action,
})


export default new ZipStore()
