import { observable, decorate, action } from 'mobx';

class RetailStore {
  activeContent = '';

  setActiveContent(content) {
    this.activeContent = content;
  }
}

decorate(RetailStore, {
  activeContent: observable,
  setActiveContent: action,
});

export default new RetailStore();
