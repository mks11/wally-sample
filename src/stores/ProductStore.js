import { observable, decorate, action, computed } from 'mobx';
import {
  API_GET_PRODUCT_DETAIL,
  API_GET_ADVERTISEMENTS,
  API_GET_PRODUCT_DISPLAYED,
  API_GET_IMPULSE_PRODUCTS,
  // API_GET_CATEGORIES,
  API_SEARCH_KEYWORD,
  API_GET_HISTORICAL_PRODUCTS,
  API_RATE_PRODUCT,
  // API_GET_PRODUCTS_MATCHING_FILTERS,
} from '../config';
import UserStore from './UserStore';
import axios from 'axios';
import moment from 'moment';

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

  customer_quantity = null;

  ads1 = null;
  ads2 = null;

  search = {
    state: false,
    all: true,
    result: [],
    display: [],
    term: '',
    filters: [],
  };

  currentSearchFilter = [];
  currentSearchCategory = 'All Categories';

  products = [];

  /*** Vendor filters */
  availableLifestyles = [];
  selectedLifestyles = [];
  availableValues = [];
  selectedValues = [];
  availableSubcategories = [];
  selectedSubcategories = [];
  availableBrands = [];
  selectedBrands = [];
  /*** Ends Vendor filters */

  /***  Vendor computed properties  */
  get filteredProducts() {
    if (
      !this.selectedLifestyles.length &&
      !this.selectedSubcategories.length &&
      !this.selectedBrands.length &&
      !this.selectedValues.length
    ) {
      return this.products;
    }

    return this.products.filter(
      ({ lifestyles = [], subcategory, vendorFull = {}, values }) => {
        const inLifestyles =
          !this.selectedLifestyles.length ||
          this.selectedLifestyles.every((ls) => lifestyles.includes(ls));

        const inValues =
          !this.selectedValues.length ||
          this.selectedValues.every((val) => values.includes(val));

        const inSubcategory =
          !this.selectedSubcategories.length ||
          this.selectedSubcategories.includes[subcategory];

        const inBrands =
          !this.selectedBrands.length ||
          this.selectedBrands.includes[vendorFull.name];

        return inLifestyles && inValues && inSubcategory && inBrands;
      },
    );
  }
  /*** Ends Vendor computed properties */

  /*** Vendor filtering actions */
  initializeProductAssortment(assortmentDetails = {}) {
    const {
      products = [],
      lifestyles = [],
      values = [],
      subcategories = [],
      brands = [],
    } = assortmentDetails;
    this.products = products;
    this.availableLifestyles = lifestyles;
    this.availableValues = values;
    this.availableSubcategories = subcategories;
    this.availableBrands = brands;
  }

  resetProductAssortment() {
    this.availableBrands = [];
    this.availableLifestyles = [];
    this.availableSubcategories = [];
    this.availableValues = [];
    this.selectedBrands = [];
    this.selectedLifestyles = [];
    this.selectedSubcategories = [];
    this.selectedValues = [];
  }

  resetSelectedFilters() {
    this.selectedBrands = [];
    this.selectedLifestyles = [];
    this.selectedSubcategories = [];
    this.selectedValues = [];
  }

  addSelectedLifestyle(lifestyle) {
    if (!this.selectedLifestyles.includes(lifestyle)) {
      this.selectedLifestyles.push(lifestyle);
    }
  }

  removeSelectedLifestyle(lifestyle) {
    this.selectedLifestyles = this.selectedLifestyles.filter(
      (style) => style !== lifestyle,
    );
  }

  addSelectedSubcategory(subcategory) {
    if (!this.selectedSubcategories.includes(subcategory)) {
      this.selectedSubcategories.push(subcategory);
    }
  }

  removeSelectedSubcategory(subcategory) {
    this.selectedSubcategories = this.selectedSubcategories.filter(
      (cat) => cat !== subcategory,
    );
  }

  addSelectedBrand(brand) {
    if (!this.selectedBrands.includes(brand)) {
      this.selectedBrands.push(brand);
    }
  }

  removeSelectedBrand(brand) {
    this.selectedBrands = this.selectedBrands.filter((br) => br !== brand);
  }

  addSelectedValue(value) {
    if (!this.selectedValues.includes(value)) {
      this.selectedValues.push(value);
    }
  }

  removeSelectedValue(value) {
    this.selectedValues = this.selectedValues.filter((v) => v !== value);
  }
  /*** Ends Vendor filtering actions */

  async showModal(product_id, customer_quantity) {
    this.activeProductId = product_id;

    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const res = await axios.get(
      `${API_GET_PRODUCT_DETAIL}${product_id}?time=${time}`,
    );
    this.activeProductComments = await this.getComments(product_id);
    this.activeProduct = res.data;
    var min_size = 1;

    this.customer_quantity = customer_quantity ? customer_quantity : min_size;

    return res.data;
  }

  resetActiveProduct() {
    this.activeProduct = null;
  }

  getAdvertisements() {
    axios
      .get(API_GET_ADVERTISEMENTS)
      .then((resp) => {
        this.ads1 = resp.data.ads1;
        this.ads2 = resp.data.ads2;
      })
      .catch((e) => {
        console.error('Failed to load advertisement', e);
      });
  }

  async getProductDisplayed(id, delivery, auth) {
    let res;
    this.main_display = [];

    this.fetch = true;
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED;

    if (auth && auth.headers.Authorization !== 'Bearer undefined') {
      res = await axios.get(
        `${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
        auth,
      );
    } else {
      res = await axios.get(
        `${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
      );
    }
    const data = res.data;

    this.main_display = data.main_products;

    this.path = data.path;
    this.sidebar = data.sidebar;
    this.fetch = false;

    return res.data;
  }

  async getImpulseProducts(auth) {
    let res;
    this.impulse_products = [];

    this.fetch = true;

    if (auth && auth.headers.Authorization !== 'Bearer undefined') {
      res = await axios.get(`${API_GET_IMPULSE_PRODUCTS}`, auth);
    } else {
      res = await axios.get(`${API_GET_IMPULSE_PRODUCTS}`);
    }
    const data = res.data;

    this.impulse_products = data.products;

    this.path = data.path;
    this.sidebar = data.sidebar;
    this.fetch = false;

    return res.data;
  }

  async getHistoricalProducts(auth) {
    let res;
    if (auth && auth.headers.Authorization !== 'Bearer undefined') {
      res = await axios.get(API_GET_HISTORICAL_PRODUCTS, auth);
    } else {
      res = await axios.get(API_GET_HISTORICAL_PRODUCTS);
    }
    this.historical_products = res.data.products;
    return res.data.products;
  }

  async getProductDetails(id, delivery) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    this.fetch = true;
    const res = await axios.get(
      `${API_GET_PRODUCT_DETAIL}${id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
    );
    this.fetch = false;
    return res.data;
  }

  async getComments(id) {
    if (!id) return null;
    this.fetch = true;
    const url = API_GET_PRODUCT_DISPLAYED + id + '/comments';
    const res = await axios.get(url);
    this.fetch = false;
    return res.data.comments;
  }

  async rateProduct(product_id, rating, comment) {
    const url = API_RATE_PRODUCT + product_id + '/rating';
    const payload = { rating, comment };
    const auth = {
      headers: { Authorization: 'Bearer ' + UserStore.token.accessToken },
    };

    const res = await axios.post(url, payload, auth);
    return res.data;
  }

  updateRatingComments(rating, comments) {
    this.activeProduct = { ...this.activeProduct, avg_rating: rating };
    this.activeProductComments = comments;
  }

  // getCategories() {
  //   axios
  //     .get(API_GET_CATEGORIES)
  //     .then(resp => {
  //       const data = resp.data;
  //       this.categories = data;
  //     })
  //     .catch(e => console.error("Failed to load categories: ", e));
  // }

  async searchKeyword(keyword, delivery, auth) {
    let res;
    const term = keyword;
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    keyword = encodeURIComponent(keyword);

    if (auth && auth.headers.Authorization !== 'Bearer undefined') {
      res = await axios.get(
        `${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
        auth,
      );
    } else {
      res = await axios.get(
        `${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`,
      );
    }

    this.search = {
      state: true,
      all: true,
      result: res.data.products || [],
      display: res.data.products || [],
      term,
      filters: res.data.filters || [],
    };
    this.currentSearchFilter =
      res.data &&
      res.data.filters &&
      res.data.filters.map((filter) => filter.cat_id);
    this.currentSearchCategory = 'All Categories';

    return res.data;
  }

  searchCategory(id) {
    const index = this.currentSearchFilter.indexOf(id);

    index === -1
      ? this.currentSearchFilter.push(id)
      : this.currentSearchFilter.splice(index, 1);

    const filteredSearchResult = this.search.result.filter((d) => {
      return this.currentSearchFilter.indexOf(d.cat_id) !== -1;
    });

    let currentCategory = this.search.filters.reduce((sum, d) => {
      if (this.currentSearchFilter.indexOf(d.cat_id) !== -1) {
        sum.push(d.cat_name);
      }
      return sum;
    }, []);

    let currentSearchCategory = currentCategory.join(', ');
    this.search.all = false;

    if (this.currentSearchFilter.length === this.search.filters.length) {
      this.search.all = true;
      currentSearchCategory = 'All Categories';
    }

    this.search.display = filteredSearchResult;
    this.currentSearchCategory = currentSearchCategory;
  }

  searchAll() {
    if (!this.search.all) {
      this.currentSearchFilter = this.search.filters.map(
        (filter) => filter.cat_id,
      );
      this.search.display = this.search.result.filter((d) => {
        return this.currentSearchFilter.indexOf(d.cat_id) !== -1;
      });
      this.currentSearchCategory = 'All Categories';
    }
    this.search.all = !this.search.all;
  }

  resetSearch() {
    this.search = {
      state: false,
      all: true,
      result: [],
      display: [],
      term: '',
      filters: [],
    };

    this.currentSearchFilter = [];
    this.currentSearchCategory = 'All Categories';
  }

  getProductsMatchingFilters() {}
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
  filters: observable,

  /*** Vendor
   * Vendor observables */
  products: observable,
  availableLifestyles: observable,
  selectedLifestyles: observable,
  availableSubcategories: observable,
  selectedSubcategories: observable,
  availableBrands: observable,
  selectedBrands: observable,
  availableValues: observable,
  selectedValues: observable,
  /*** Vendor computed */
  filteredProducts: computed,
  /*** Vendor actions */
  initializeProductAssortment: action,
  resetProductAssortment: action,
  resetSelectedFilters: action,
  addSelectedLifestyle: action,
  removeSelectedLifestyle: action,
  addSelectedSubcategory: action,
  removeSelectedSubcategory: action,
  addSelectedBrand: action,
  removeSelectedBrand: action,
  addSelectedValue: action,
  removeSelectedValue: action,
  /** Ends Vendor */
  resetActiveProduct: action,
  showModal: action,
  getAdvertisements: action,
  getProductDisplayed: action,
  getCategories: action,
  searchKeyword: action,
  searchCategory: action,
  searchAll: action,
  resetSearch: action,
  getProductDetails: action,
  rateProduct: action,
  updateRatingComments: action,
  getHistoricalProducts: action,
  getProductComments: action,
  getProductsMatchingFilters: action,
});

export default new ProductStore();
