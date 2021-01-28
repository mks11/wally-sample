import { observable, decorate, action, computed } from 'mobx';

// API
import { getImpulseProducts } from 'api/product';

// Sorting Config
import sortingConfig, {
  DEFAULT_SORTING_OPTION,
  POSSIBLE_SORTING_OPTIONS,
} from 'common/ProductAssortment/SortAndFilterMenu/sorting-config';

import {
  API_GET_PRODUCT_DETAIL,
  API_GET_ADVERTISEMENTS,
  API_GET_PRODUCT_DISPLAYED,
  // API_GET_CATEGORIES,
  API_SEARCH_KEYWORD,
  API_GET_HISTORICAL_PRODUCTS,
  API_RATE_PRODUCT,
  // API_GET_PRODUCTS_MATCHING_FILTERS,
} from '../config';
import UserStore from './UserStore';
import axios from 'axios';
import moment from 'moment';

export const initialProductAssortmentPrefs = {
  selectedSortingOption: DEFAULT_SORTING_OPTION,
  selectedBrands: [],
  selectedLifestyles: [],
  selectedSubcategories: [],
  selectedValues: [],
};
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

  // Product filtration - temporary implementation
  filters = [];
  addFilter = (filter) => {
    this.filters.push(filter);
  };
  removeFilter = (idx) => {
    this.filters.splice(idx, 1);
  };
  updateFilters(filters) {
    this.filters = filters;
  }
  resetFilters() {
    this.filters = [];
  }

  // ================= Product Assortment V2 - WIP =================

  products = [];

  // Sorting Options
  selectedSortingOption = DEFAULT_SORTING_OPTION;

  // Lifestyle Tag Filters
  availableLifestyles = [];
  selectedLifestyles = [];

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

  // Value Tag Filters
  availableValues = [];
  selectedValues = [];

  addSelectedValue(value) {
    if (!this.selectedValues.includes(value)) {
      this.selectedValues.push(value);
    }
  }

  removeSelectedValue(value) {
    this.selectedValues = this.selectedValues.filter((v) => v !== value);
  }

  // Subcat Tag Filters
  availableSubcategories = [];
  selectedSubcategories = [];

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

  // Brand Tag Filters
  availableBrands = [];
  selectedBrands = [];

  addSelectedBrand(brand) {
    if (!this.selectedBrands.includes(brand)) {
      this.selectedBrands.push(brand);
    }
  }

  removeSelectedBrand(brand) {
    this.selectedBrands = this.selectedBrands.filter((br) => br !== brand);
  }

  get filteredProducts() {
    let products = filterByLifeStylesBrandSubcategoryAndValues(this.products, {
      selectedLifestyles: this.selectedLifestyles,
      selectedSubcategories: this.selectedSubcategories,
      selectedValues: this.selectedValues,
      selectedBrands: this.selectedBrands,
    });

    const sortingOption = this.selectedSortingOption;

    if (sortingOption) {
      const selectedSortingConfig = sortingConfig.find(
        (option) => option.value === sortingOption,
      );

      if (selectedSortingConfig) {
        const { sortingFunction } = selectedSortingConfig;

        // Separate in stock and out of stock products

        let inStockProducts = products.filter((p) => {
          const { inventory } = p;
          if (!inventory || !inventory.length) return false;
          return p.inventory[0].current_inventory > 0;
        });

        let outOfStockProducts = products.filter((p) => {
          const { inventory } = p;
          if (!inventory || !inventory.length) return false;
          return p.inventory[0].current_inventory === 0;
        });

        // Sort both in stock and out of stock products

        inStockProducts = sortingFunction(inStockProducts);
        outOfStockProducts = sortingFunction(outOfStockProducts);

        // Push out of stock products to end of product assortment

        products = inStockProducts.concat(outOfStockProducts);
      }
    }

    return products;
  }

  initializeProductAssortment({
    products = [],
    brands = [],
    lifestyles = [],
    subcategories = [],
    values = [],
  }) {
    this.products = products;
    this.availableBrands = brands;
    this.availableLifestyles = lifestyles;
    this.availableSubcategories = subcategories;
    this.availableValues = values;
  }

  resetProductAssortmentPrefs() {
    const {
      selectedSortingOption,
      selectedBrands,
      selectedLifestyles,
      selectedSubcategories,
      selectedValues,
    } = initialProductAssortmentPrefs;

    this.selectedSortingOption = selectedSortingOption;
    this.selectedBrands = selectedBrands;
    this.selectedLifestyles = selectedLifestyles;
    this.selectedSubcategories = selectedSubcategories;
    this.selectedValues = selectedValues;
  }

  setProductAssortmentPrefs({
    selectedSortingOption = DEFAULT_SORTING_OPTION,
    selectedBrands = [],
    selectedLifestyles = [],
    selectedSubcategories = [],
    selectedValues = [],
  }) {
    // This situation is unlikely, but may assist in debugging.
    // TODO: extend as needed.
    if (!POSSIBLE_SORTING_OPTIONS.includes(selectedSortingOption)) {
      console.error(`Invalid sorting value: ${selectedSortingOption}`);
    }

    this.selectedSortingOption = selectedSortingOption;
    this.selectedBrands = selectedBrands;
    this.selectedLifestyles = selectedLifestyles;
    this.selectedSubcategories = selectedSubcategories;
    this.selectedValues = selectedValues;
  }

  // ================== End Product Assortment Filtration V2 ==================

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

  getImpulseProducts(cartId, auth) {
    this.fetch = true;
    return getImpulseProducts(cartId, auth).then((res) => {
      this.fetch = false;
      return res;
    });
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

  // Product Assortment V2
  products: observable,

  selectedSortingOption: observable,

  availableLifestyles: observable,
  selectedLifestyles: observable,
  addSelectedLifestyle: action,
  removeSelectedLifestyle: action,

  availableSubcategories: observable,
  selectedSubcategories: observable,
  addSelectedSubcategory: action,
  removeSelectedSubcategory: action,

  availableBrands: observable,
  selectedBrands: observable,
  addSelectedBrand: action,
  removeSelectedBrand: action,

  availableValues: observable,
  selectedValues: observable,
  addSelectedValue: action,
  removeSelectedValue: action,

  filteredProducts: computed,
  initializeProductAssortment: action,
  resetProductAssortmentPrefs: action,
  setProductAssortmentPrefs: action,

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
  addFilter: action,
  removeFilter: action,
  updateFilters: action,
  resetFilters: action,
});

export function applyFilters(
  products,
  { selectedLifestyles, selectedValues, selectedSubcategories, selectedBrands },
) {
  return products.filter(
    ({ lifestyles = [], subcategory = {}, vendorFull = {}, values = [] }) => {
      const inLifestyles =
        !selectedLifestyles.length ||
        selectedLifestyles.every((ls) => lifestyles.includes(ls));

      const inValues =
        !selectedValues.length ||
        selectedValues.every((val) => values.includes(val));

      const inSubcategory =
        !selectedSubcategories.length ||
        (subcategory &&
          subcategory.name &&
          selectedSubcategories.includes(subcategory.name));
      const inBrands =
        !selectedBrands.length ||
        (vendorFull &&
          vendorFull.name &&
          selectedBrands.includes(vendorFull.name));

      return inLifestyles && inValues && inSubcategory && inBrands;
    },
  );
}

export default new ProductStore();
