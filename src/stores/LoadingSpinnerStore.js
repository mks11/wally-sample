import { observable, decorate } from "mobx";

class LoadingSpinnerStore {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

decorate(LoadingSpinnerStore, {
  isOpen: observable,
});

export default new LoadingSpinnerStore();
