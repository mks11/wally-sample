import axios from 'axios';
import { API_GET_CATEGORIES, API_GET_SUBCATEGORIES } from 'config';
import { observable, decorate, action, runInAction } from 'mobx';
import userStore from './UserStore';
// import

class RetailStore {
  activeContent = '';

  categories = [];
  subcategories = [];

  setActiveContent(content) {
    this.activeContent = content;
  }

  async getCategories({ refetch = false } = {}) {
    if (refetch || this.categories.length === 0) {
      const { data } = await axios.get(
        API_GET_CATEGORIES,
        userStore.getHeaderAuth(),
      );
      runInAction(() => {
        this.categories = data;
      });
    }

    return this.categories;
  }

  async getSubcategories({ refetch = false } = {}) {
    if (refetch || this.subcategories.length === 0) {
      const { data } = await axios.get(
        API_GET_SUBCATEGORIES,
        userStore.getHeaderAuth(),
      );
      runInAction(() => {
        this.subcategories = data;
      });
    }

    return this.subcategories;
  }
}

decorate(RetailStore, {
  activeContent: observable,
  categories: observable,
  setActiveContent: action,

  getCategories: action,
  getSubcategories: action,
});

export default new RetailStore();
