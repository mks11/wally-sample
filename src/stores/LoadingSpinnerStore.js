import { observable, decorate, action } from "mobx";

class LoadingSpinnerStore {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  hide() {
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
  }
}

decorate(LoadingSpinnerStore, {
  isOpen: observable,

  toggle: action,
  hide: action,
  show: action,
});

export default new LoadingSpinnerStore();
