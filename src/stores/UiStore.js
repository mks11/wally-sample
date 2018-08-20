import {observable, decorate, action} from 'mobx'

let index = 0

class UiStore {
  accountDropdown = false
  cartDropdown = false
  categoriesDropdown = false
  backdrop = false
  backdropTop = 0
  backdropZindex = 100

  toggleAccountDropdown() {
    this.backdropZindex = 101
    this.backdropTop = 0
    this.backdrop = !this.backdrop
    this.accountDropdown = !this.accountDropdown

    if (this.accountDropdown) {
      this.backdrop = true
      this.cartDropdown = false
      this.categoriesDropdown = false
    }
  }

  toggleCartDropdown() {
    this.backdropTop = 70
    this.backdrop = !this.backdrop
    this.cartDropdown = !this.cartDropdown

    if (this.cartDropdown) {
      this.backdrop = true
      this.accountDropdown = false
      this.categoriesDropdown = false
    }
  }

  toggleCategoriesDropdown() {
    this.backdropTop = 70
    this.backdrop = !this.backdrop
    this.categoriesDropdown = !this.categoriesDropdown

    if (this.categoriesDropdown) {
      this.backdrop = true
      this.accountDropdown = false
      this.cartDropdown = false
    }
    
  }

  showBackdrop(top) {
    this.backdrop = true
    this.backdropTop = top ? top : 0
    this.backdropZindex = 100
  }

  hideBackdrop() {
    this.backdrop = false
    this.backdropTop = 0
  }
  
  hideAllDropdown() {
    this.backdropZindex = 100
    this.backdrop = false
    this.backdropTop = 0
    this.accountDropdown = false
    this.cartDropdown = false
    this.categoriesDropdown = false
  }

}

decorate(UiStore, {
  accountDropdown: observable,
  cartDropdown: observable,
  categoriesDropdown: observable,
  backdropTop: observable,
  backdrop: observable,
  toggleAccountDropdown: action,
  toggleCartDropdown: action,
  toggleCategoriesDropdown: action,
  hideAllDropdown: action,
})


export default new UiStore()
