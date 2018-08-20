import {observable, decorate, action} from 'mobx'
import { 
   } from '../config'
import axios from 'axios'

let index = 0

class CheckoutStore {
  orders  = []

  getOrders() {
    axios.get(API_GET_CURRENT_CART)
      .then(resp => {
        this.cart = resp.data
      })
  }

}

decorate(CheckoutStore, {
  cart: observable,
  getCurrentCart: action
})


export default new CheckoutStore()
