import {observable, decorate, action} from 'mobx'
import { API_GET_PACKAGING_UNIT } from '../config'

import axios from 'axios'

class PackagingUnitStore {
  packagingUnit = null
  fetch = false

  async getPackagingUnit(id){
    this.fetch = true
    const res = await axios(`${API_GET_PACKAGING_UNIT}${id}`)
    this.fetch = false
    this.packagingUnit = res.data
    return res.data
  }
}

decorate(PackagingUnitStore, {
  packagingUnit: observable,
  fetch: observable,

  getPackagingUnit: action
})

export default new PackagingUnitStore()
