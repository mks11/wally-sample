import { observable, decorate, action } from 'mobx';

class ModalStoreV2 {
  constructor() {
    this.anchor = 'right';
    this.isOpen = false;
    this.children = null;
  }

  open(children, anchor = 'right') {
    this.anchor = anchor;
    this.children = children;
    this.isOpen = true;
  }

  close() {
    this.children = null;
    this.isOpen = false;
  }
}

decorate(ModalStoreV2, {
  anchor: observable,
  isOpen: observable,
  children: observable,
  open: action,
  close: action,
});

export default new ModalStoreV2();
