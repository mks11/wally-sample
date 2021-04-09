import { observable, decorate, action } from 'mobx';

class DialogStore {
  constructor() {
    this.isOpen = false;
    this.content = null;
  }

  open(content) {
    this.isOpen = true;
    this.content = content;
  }

  close() {
    this.isOpen = false;
    this.content = null;
  }
}

decorate(DialogStore, {
  isOpen: observable,
  content: observable,
  open: action,
  close: action,
});

export default new DialogStore();
