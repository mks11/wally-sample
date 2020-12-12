import { observable, decorate, action } from 'mobx';

class ModalStoreV2 {
  constructor() {
    this.anchor = 'right';
    this.isOpen = false;
    this.children = null;
    this.maxWidth = 'sm';
  }

  open(children, anchor = 'right', maxWidth = 'sm', paperStyle = undefined) {
    this.anchor = anchor;
    this.children = children;
    this.isOpen = true;
    this.maxWidth = maxWidth;
    this.paperStyle = paperStyle;
  }

  close() {
    this.isOpen = false;
  }
}

decorate(ModalStoreV2, {
  anchor: observable,
  isOpen: observable,
  children: observable,
  maxWidth: observable,
  open: action,
  close: action,
});

export default new ModalStoreV2();
