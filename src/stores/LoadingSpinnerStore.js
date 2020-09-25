import { observable, decorate, action } from 'mobx';

class LoadingSpinnerStore {
  isOpen = false;
  count = 0;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  hide() {
    this.count -= 1;
    if (this.count === 0) {
      this.isOpen = false;
    }
  }

  show() {
    this.isOpen = true;
    this.count += 1;
  }
}

decorate(LoadingSpinnerStore, {
  isOpen: observable,

  toggle: action,
  hide: action,
  show: action,
});

export default new LoadingSpinnerStore();
