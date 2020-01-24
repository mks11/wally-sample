import {observable, decorate, action} from 'mobx'

class UiStore {
  accountDropdown = false
  backdrop = false
  backdropTop = 0
  backdropZindex = 100
  navMobile = false;
  topBar = false;
  cartMobile = false;

  closeTopBar() {
    this.topBar = false;
  }

  hideNavMobile() {
    this.navMobile = false
  }
  showNavMobile() {
    this.navMobile = true
  }
  
  toggleNavMobile() {
    this.navMobile = !this.navMobile
  }

  toggleCartMobile(state) {
    this.cartMobile = state
  }

  toggleAccountDropdown() {
    this.backdropZindex = 101
    this.backdropTop = 0
    this.backdrop = !this.backdrop
    this.accountDropdown = !this.accountDropdown
  }

  hideAccountDropdown() {
    if (!this.accountDropdown) {
      return
    }
    this.backdropZindex = 100
    this.backdropTop = 0
    this.backdrop = false
    this.accountDropdown = false
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
}

decorate(UiStore, {
  accountDropdown: observable,
  topBar: observable,
  cartMobile: observable,
  toggleCartMobile: action,

  navMobile: observable,
  toggleNavMobile: action,
  closeTopBar: action,
  showNavMobile: action,
  hideNavMobile: action,
  
  backdropTop: observable,
  backdrop: observable,
  hideAccountDropdown: action,
  toggleAccountDropdown: action,
})


export default new UiStore()
