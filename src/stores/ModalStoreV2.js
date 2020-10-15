import { observable, decorate, action } from 'mobx';

class ModalStoreV2 {
  constructor() {
    this.isOpen = false;
    this.children = null;
  }

  open(children) {
    this.children = children;
    this.isOpen = true;
  }

  close() {
    this.children = null;
    this.isOpen = false;
  }
}

decorate(ModalStoreV2, {
  isOpen: observable,
  children: observable,
  open: action,
  close: action,
});

export default new ModalStoreV2();
