import {observable, decorate, action} from 'mobx'

let index = 0

class ModalStore {
  login = false
  loginStep = 1
  loginNextRoute = '/'

  signup = false
  welcome = false
  zip = false
  invalidZip = false
  invalidZipSuccess = false

  invite = false

  product = false
  productId = null

  changeProduct = false
  changeFarm = false
  changePrice = false

  deliveryChange = false
  deliveryChangeType = null
  deliveryChangeData = null

  showDeliveryChange(type, data) {
    this.deliveryChange = true
    this.deliveryChangeType = type
    this.deliveryChangeData = data
  }

  hideDeliveryChange() {
    this.deliveryChange = false
    this.deliveryChangeType = null
    this.deliveryChangeData = null
  }

  toggleLogin() {
    this.login = !this.login
    this.loginStep = 1
  }

  setLoginStep(step) {
    this.loginStep = step
  }

  toggleSignup() {
    this.signup = !this.signup
  }

  toggleZip() {
    this.zip = !this.zip
  }

  toggleInvalidZip() {
    this.invalidZip = !this.invalidZip
  }

  toggleInvalidZipSuccess() {
    this.invalidZipSuccess = !this.invalidZipSuccess
  }



  toggleInvite() {
    this.invite = !this.invite
  }

  toggleWelcome() {
    this.welcome = !this.welcome
  }

  toggleProduct(id) {
    this.product = !this.product
    if (id) {
      this.productId = id
    } else {
      this.productId = null
    }
  }

  setLoginNextRoute(route) {
    this.loginNextRoute = '/checkout'
  }

  toggleChangeProduct() {
    this.changeProduct = !this.changeProduct
  }

  toggleChangeFarm() {
    this.changeFarm = !this.changeFarm
  }

  toggleChangePrice() {
    this.changePrice = !this.changePrice
  }

}

decorate(ModalStore, {
  login: observable,
  loginStep: observable,
  loginNextRoute: observable,
  signup: observable,
  welcome: observable,
  zip: observable,
  invalidZip: observable,
  invalidZipSuccess: observable,
  invite: observable,
  product: observable,
  productId: observable,
  changeProduct: observable,
  changeFarm: observable,
  changePrice: observable,
  toggleLogin: action,
  toggleSignup: action,
  toggleZip: action,
  setLoginStep: action,
  toggleInvalidZip: action,
  toggleInvalidSuccess: action,
  toggleInvite: action,
  toggleWelcome: action,
  setLoginNextRoute: action,
  deliveryChange: observable,
  showDeliveryChange: action,
  hideDeliveryChange: action
  toggleChangeProduct: action,
  toggleChangeFarm: action,
  toggleChangePrice: action
})


export default new ModalStore()
