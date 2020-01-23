import { observable, decorate, action } from "mobx";
import {
  API_GET_PRODUCT_DETAIL,
  API_GET_ADVERTISEMENTS,
  API_GET_PRODUCT_DISPLAYED,
  API_GET_IMPULSE_PRODUCTS,
  API_GET_CATEGORIES,
  API_SEARCH_KEYWORD,
  API_GET_HISTORICAL_PRODUCTS,
  API_RATE_PRODUCT
} from "../config";
import axios from "axios";
import moment from "moment";

class ProductStore {
  main_display = [];
  historical_products = [];
  path = [];
  sidebar = [];
  activeProductId = null;
  activeProduct = null;
  activeProductComments = [];
  categories = [];
  fetch = false;

  fetch = false;

  customer_quantity = null;

  ads1 = null;
  ads2 = null;

  search = {
    state: false,
    all: true,
    result: [],
    display: [],
    term: "",
    filters: []
  };

  currentSearchFilter = [];
  currentSearchCategory = "All Categories";

  async showModal(product_id, customer_quantity, delivery) {
    this.activeProductId = product_id;

    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    const res = await axios.get(
      `${API_GET_PRODUCT_DETAIL}${product_id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`
    );
    this.activeProduct = res.data;
    if (this.activeProduct.available_inventory.length === 0) {
      alert("Item not available in inventory");
      return;
    }
    const inventory = this.activeProduct.available_inventory[0];
    var min_size = this.activeProduct.buy_by_packaging
      ? 1
      : this.activeProduct.min_size;

    this.customer_quantity = customer_quantity ? customer_quantity : min_size;
    return res.data;
  }

  getAdvertisements() {
    axios
      .get(API_GET_ADVERTISEMENTS)
      .then(resp => {
        this.ads1 = resp.data.ads1;
        this.ads2 = resp.data.ads2;
      })
      .catch(e => {
        console.error("Failed to load advertisement", e);
      });
  }

  async getProductDisplayed(id, delivery, auth) {
    let res;
    this.main_display = [];

    this.fetch = true;
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED;

    if (auth && auth.headers.Authorization != "Bearer undefined") {
      res = await axios.get(
        `${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
        auth
      );
    } else {
      res = await axios.get(
        `${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`
      );
    }
    const data = res.data;

    this.main_display = data.main_products;

    this.path = data.path;
    this.sidebar = data.sidebar;
    this.fetch = false;

    return res.data;
  }

  async getImpulseProducts(id, auth) {
    let res;
    this.impulse_products = [];

    this.fetch = true;

    // const url = id ? API_GET_IMPULSE_PRODUCTS + id : API_GET_IMPULSE_PRODUCTS;
    const url = API_GET_IMPULSE_PRODUCTS;

    if (auth && auth.headers.Authorization != "Bearer undefined") {
      res = await axios.get(`${url}`, auth);
    } else {
      res = await axios.get(`${url}`);
    }
    const data = res.data;

    this.impulse_products = data.products;

    this.path = data.path;
    this.sidebar = data.sidebar;
    this.fetch = false;

    return res.data;
  }

  async getHistoricalProducts() {
    const res = await axios.get(API_GET_HISTORICAL_PRODUCTS);
    this.historical_products = res.data.products;

    return res.data.products;
  }

  async getProductDetails(id, delivery) {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    this.fetch = true;
    const res = await axios.get(
      `${API_GET_PRODUCT_DETAIL}${id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`
    );
    this.fetch = false;
    return res.data;
  }

  async getComments(id) {
    if (!id) return null;
    this.fetch = true;
    const url = API_GET_PRODUCT_DISPLAYED + id + "/comments";
    try {
      const res = await axios.get(url);
      this.activeProductComments = res.data;
    } catch (err) {
      console.error(err);
    }
    this.fetch = false;
  }

  async rateProduct(id, rating, comment) {
    const url = API_RATE_PRODUCT + id + "/rating";
    try {
      const res = await axios.post(url, {
        product_id: id,
        product_rating: rating,
        comment: comment
      });
      this.activeProduct.rating = res.data.product_rating;
      this.activeProductComments = res.data.comments;
    } catch (err) {
      console.error(err);
    }
  }

  getCategories() {
    axios
      .get(API_GET_CATEGORIES)
      .then(resp => {
        const data = resp.data;
        this.categories = data;
      })
      .catch(e => console.error("Failed to load categories: ", e));
  }

  async searchKeyword(keyword, delivery, auth) {
    let res;
    const term = keyword;
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    keyword = encodeURIComponent(keyword);

    if (auth && auth.headers.Authorization != "Bearer undefined") {
      res = await axios.get(
        `${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
        auth
      );
    } else {
      res = await axios.get(
        `${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`
      );
    }

    this.search = {
      state: true,
      all: true,
      result: res.data.products || [],
      display: res.data.products || [],
      term,
      filters: res.data.filters || []
    };
    this.currentSearchFilter = res.data.filters.map(filter => filter.cat_id);
    this.currentSearchCategory = "All Categories";

    return res.data;
  }

  searchCategory(id) {
    const index = this.currentSearchFilter.indexOf(id);

    index === -1
      ? this.currentSearchFilter.push(id)
      : this.currentSearchFilter.splice(index, 1);

    const filteredSearchResult = this.search.result.filter(d => {
      return this.currentSearchFilter.indexOf(d.cat_id) !== -1;
    });

    let currentCategory = this.search.filters.reduce((sum, d) => {
      if (this.currentSearchFilter.indexOf(d.cat_id) !== -1) {
        sum.push(d.cat_name);
      }
      return sum;
    }, []);

    let currentSearchCategory = currentCategory.join(", ");
    this.search.all = false;

    if (this.currentSearchFilter.length === this.search.filters.length) {
      this.search.all = true;
      currentSearchCategory = "All Categories";
    }

    this.search.display = filteredSearchResult;
    this.currentSearchCategory = currentSearchCategory;
  }

  searchAll() {
    if (!this.search.all) {
      this.currentSearchFilter = this.search.filters.map(
        filter => filter.cat_id
      );
      this.search.display = this.search.result.filter(d => {
        return this.currentSearchFilter.indexOf(d.cat_id) !== -1;
      });
      this.currentSearchCategory = "All Categories";
    }
    this.search.all = !this.search.all;
  }

  resetSearch() {
    this.search = {
      state: false,
      all: true,
      result: [],
      display: [],
      term: "",
      filters: []
    };

    this.currentSearchFilter = [];
    this.currentSearchCategory = "All Categories";
  }
}

decorate(ProductStore, {
  main_display: observable,
  historical_products: observable,
  path: observable,
  sidebar: observable,
  customer_quantity: observable,
  fetch: observable,
  categories: observable,
  activeProduct: observable,
  activeProductId: observable,
  search: observable,
  currentSearchFilter: observable,

  showModal: action,
  getAdvertisements: action,
  getProductDisplayed: action,
  getCategories: action,
  searchKeyword: action,
  searchCategory: action,
  searchAll: action,
  resetSearch: action,
  getProductDetails: action,
  getHistoricalProducts: action,
  getProductComments: action
});

export default new ProductStore();
