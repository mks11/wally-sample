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

  findCategoryById(catId) {
    return this.categories.find((c) => c.category_id === catId);
  }

  isCategoryCached = (catId) => {
    if (this.findCategoryById(catId)) {
      return true;
    }

    return false;
  };

  getCachedCatIndex(catId) {
    return this.categories.findIndex((c) => c.category_id === catId);
  }

  addCategory(category) {
    if (this.isCategoryCached(category.category_id)) {
      return;
    }
    this.categories.push(category);
    this.categories = sort(this.categories);
  }

  updateCategories(category) {
    const { category_id } = category;
    const idx = this.getCachedCatIndex(category_id);
    if (idx > -1) {
      this.categories.splice(idx, 1, category);
      this.categories = sort(this.categories);
    }
  }

  removeCategory(catId) {
    this.categories = this.categories.filter((c) => c.category_id !== catId);
  }

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

  // ACTIONS THAT REGARD THE CATEGORIES PROPERTY
  setActiveContent: action,
  isCategoryCached: action,
  getCachedCatIndex: action,
  addCategory: action,
  updateCategories: action,
  removeCategory: action,
  // API CALLS
  getCategories: action,
  getSubcategories: action,
});

export default new RetailStore();

function sort(list) {
  return list.sort((a, b) => {
    const aName = a.name;
    const bName = b.name;

    if (aName > bName) return 1;
    else if (aName < bName) return -1;
    else return 0;
  });
}
