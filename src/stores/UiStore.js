import {observable, decorate, action} from 'mobx'

class UiStore {
  accountDropdown = false
  cartDropdown = false
  categoriesDropdown = false
  backdrop = false
  backdropTop = 0
  backdropZindex = 100
  navMobile = false;
  topBar = true;
  topBarClosed = false;
  cartMobile = false;
  categoryMobile = false;

  closeTopBar() {
    this.topBar = false;
    this.topBarClosed = true;
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

  toggleCategoryMobile() {
    this.categoryMobile = !this.categoryMobile
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

  hideCategoriesDropdown() {
    if (!this.categoriesDropdown) {
      return
    }
    this.backdropZindex = 100
    this.backdropTop = 0
    this.backdrop = false
    this.categoriesDropdown = false
  }


  hideCartDropdown() {
    if (!this.cartDropdown) {
      return
    }
    this.backdropZindex = 70
    this.backdropTop = 0
    this.backdrop = false
    this.cartDropdown = false
  }
  toggleCartDropdown(state) {
    this.backdropTop = 70
    this.backdrop = state
    this.cartDropdown = state
  }

  toggleCategoriesDropdown() {
     this.backdropTop = 70
    this.backdrop = !this.backdrop
    this.categoriesDropdown = !this.categoriesDropdown
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
  topBar: observable,
  topBarClosed: observable,
  cartMobile: observable,
  categoryMobile: observable,
  toggleCartMobile: action,
  toggleCategoryMobile: action,

  navMobile: observable,
  toggleNavMobile: action,
  closeTopBar: action,
  showNavMobile: action,
  hideNavMobile: action,
  
  backdropTop: observable,
  backdrop: observable,
  toggleAccountDropdown: action,
  toggleCartDropdown: action,
  toggleCategoriesDropdown: action,
  hideAccountDropdown: action,
  hideCategoriesDropdown: action,
  hideCartDropdown: action,
  hideAllDropdown: action,
})


export default new UiStore()
