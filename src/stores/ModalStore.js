import {observable, decorate, action} from 'mobx'

class ModalStore {
  modalPull = []

  isOpen = false
  modalId = null
  msg = null

  product = false
  productId = null

  changeProduct = false
  changeFarm = false
  changePrice = false

  delivery = false
  deliveryChange = false
  deliveryChangeType = null
  deliveryChangeData = null

  addonsFirst = false

  toggleDelivery() {
    this.delivery = !this.delivery
  }

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

  toggleModal(modalId, msg = null) {
    if (!this.modalPull.length) {
      this.switchModal(modalId)
      this.isOpen = !this.isOpen
    }
    
    if(modalId && !this.modalPull.includes(modalId)) {
      this.modalPull.push(modalId)
    }
    this.msg = msg
  }

  switchModal(modalId) {
    this.modalId = modalId || null
  }

  toggleProduct(id) {
    this.product = !this.product
    if (id) {
      this.productId = id
    } else {
      this.productId = null
    }
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

  toggleAddonsFirst() {
    this.addonsFirst = !this.addonsFirst
  }
}

decorate(ModalStore, {
  modalPull: observable,
  isOpen: observable,
  modalId: observable,
  msg: observable,
  toggleModal: action,
  switchModal: action,

  feedback: observable,
  product: observable,
  productId: observable,
  changeProduct: observable,
  changeFarm: observable,
  changePrice: observable,

  delivery: observable,
  deliveryChange: observable,
  addonsFirst: observable,

  showDeliveryChange: action,
  hideDeliveryChange: action,
  toggleChangeProduct: action,
  toggleChangeFarm: action,
  toggleChangePrice: action,
  toggleDelivery: action,
})


export default new ModalStore()
