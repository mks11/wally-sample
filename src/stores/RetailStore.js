import axios from 'axios';
import { API_CATEGORIES_GET, API_SUBCATEGORIES_GET } from 'config';
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

  addCategory(category) {
    this.categories.push(category);
  }

  isCategoryCached = (catId) => {
    return this.categories.find((c) => c.category_id === catId);
  };

  async getCategories({ refetch = false } = {}) {
    if (refetch || this.categories.length === 0) {
      const { data } = await axios.get(
        API_CATEGORIES_GET,
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
        API_SUBCATEGORIES_GET,
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
  addCategory: action,
  getCategories: action,
  getSubcategories: action,
});

export default new RetailStore();
