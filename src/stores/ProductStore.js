import {observable, decorate, action} from 'mobx'
import { 
  API_GET_PRODUCT_DETAIL,
  API_GET_ADVERTISEMENTS,
  API_GET_PRODUCT_DISPLAYED,
  API_GET_CATEGORIES,
  API_SEARCH_KEYWORD,
  API_GET_HISTORICAL_PRODUCTS,
  API_RATE_PRODUCT,
} from '../config'
import axios from 'axios'
import moment from 'moment'

class ProductStore {
  main_display = []
  historical_products = []
  path = []
  sidebar = []
  activeProductId = null
  activeProduct = null
  activeProductComments = []
  categories = []
  fetch = false

  customer_quantity = null

  ads1 = null
  ads2 = null

  search = {
    state: false,
    all: true,
    result: [],
    display: [],
    term: '',
    filters: [],
  }

  currentSearchFilter = []
  currentSearchCategory = 'All Categories'

  async showModal(product_id, customer_quantity, delivery) {    
    this.activeProductId = product_id

    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const res = await axios.get(`${API_GET_PRODUCT_DETAIL}${product_id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    this.activeProduct = res.data
    if (this.activeProduct.available_inventory.length === 0) {
      alert('Item not available in inventory')
      return
    }
    const inventory = this.activeProduct.available_inventory[0]
    var min_size = this.activeProduct.buy_by_packaging ? 1 : this.activeProduct.min_size

    this.customer_quantity = customer_quantity ? customer_quantity : min_size

    await this.getComments(product_id)
    // HERE! remove test data below
    this.activeProductComments = [{text: 'Great stuff. I only wish it would fulfill all of my needs as a human, as only cocoa powder can. My wish is for cocoa powder to bring about world peace through the sharing of delicious chocolate and also love! I want to give the world a cocoa powder.', user: "Joe"}, {text: 'One of the best powdered cocoas you can get. It rivals speciality high end products such as Valrhona that cost 3 times as much. Slightly cheaper here than at my local grocery so I use it as an add on to reach my 5 Subscribe and Save items and get maximum discount on all. Makes a great Chocolate sugar cookie. Blend 1c unsalted butter 1.5c sugar 1 egg 2 tsp vanilla, then sift together and add 1.5c flour, a generous half cup Cocoa, 1 tsp baking powder, 1 tsp baking soda, half tsp salt. Mix until combined, do not over mix.', user: "Fred"}, {text: 'The deep and full-bodied taste of this very rich cocoa powder combined with attractive pricing has made it a pantry staple. I love that it comes unsweetened, so not only am I not buying sugar, but it leaves all options open. When making hot cocoa, I have found that I prefer to sweeten with a small amount of liquid agave. The flavor is great and the sugar shock is avoided. I also bake with this cocoa with rich results. Try making truffles with this - quick, and the bomb!', user: "Molly"}, {text: 'This stuff has a great flavor and makes smooth and delicious chocolates, chocolate sauce, hot fudge, frosting, cookies, hot chocolate, brownies, truffles, chocolate cake, chocolate pudding...you name it! I\'ll never go back to that other stuff I used to use.', user: "Dan"}]
    return res.data
  }

  getAdvertisements() {
    axios.get(API_GET_ADVERTISEMENTS)
      .then((resp) => {
        this.ads1 = resp.data.ads1
        this.ads2 = resp.data.ads2
      }).catch((e) => {
        console.error('Failed to load advertisement', e)
      })
  }

  async getProductDisplayed(id, delivery, auth) {
    let res;
    this.main_display = []
    this.fetch = true
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const url = id ? API_GET_PRODUCT_DISPLAYED + id : API_GET_PRODUCT_DISPLAYED

    if (auth && auth.headers.Authorization != "Bearer undefined") {
      res = await axios.get(`${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`, auth)
    } else {
      res = await axios.get(`${url}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    }
    const data = res.data

    this.main_display = data.main_products
    this.path = data.path
    this.sidebar = data.sidebar
    this.fetch = false

    return res.data
  }

  async getHistoricalProducts() {
    const res = await axios.get(API_GET_HISTORICAL_PRODUCTS)
    this.historical_products = res.data.products

    return res.data.products
  }

  async getProductDetails(id, delivery){
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    this.fetch = true
    const res = await axios.get(`${API_GET_PRODUCT_DETAIL}${id}?time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    this.fetch = false
    return res.data
  }

  async getComments(id) {
    if (!id) return null
    this.fetch = true
    const url = API_GET_PRODUCT_DISPLAYED + id + '/comments'
    try {
      const res = await axios.get(url)
      this.activeProductComments = res.data
    } catch(err) {
      console.error(err)
    }
    this.fetch = false
  }

  async rateProduct(id, rating, comment) {
    const url = API_RATE_PRODUCT + id + '/rating'
    try {
      const res = await axios.post(url, { product_id: id, product_rating: rating, comment: comment })
      this.activeProduct.rating = res.data.product_rating
      this.activeProductComments = res.data.comments
    } catch(err) {
      console.error(err)
    }
    return res.data;
  }

  getCategories() {
    axios.get(API_GET_CATEGORIES)
      .then(resp => {
        const data = resp.data
        this.categories = data
      }).catch((e) => console.error('Failed to load categories: ', e))
  }

  async searchKeyword(keyword, delivery, auth) {
    let res;
    const term = keyword
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    keyword = encodeURIComponent(keyword)

    if (auth && auth.headers.Authorization != "Bearer undefined") {
      res = await axios.get(`${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`, auth)
    } else {
      res = await axios.get(`${API_SEARCH_KEYWORD}?keyword=${keyword}&time=${time}&delivery_zip=${delivery.zip}&delivery_date=${delivery.date}`)
    }


    this.search = {
      state: true,
      all: true,
      result: res.data.products || [],
      display: res.data.products || [],
      term,
      filters: res.data.filters || []
    }
    this.currentSearchFilter = res.data.filters.map(filter => filter.cat_id)
    this.currentSearchCategory = 'All Categories'

    return res.data
  }

  searchCategory(id) {
    const index = this.currentSearchFilter.indexOf(id)

    index === -1
      ? this.currentSearchFilter.push(id)
      : this.currentSearchFilter.splice(index, 1)

    const filteredSearchResult = this.search.result.filter((d) => {
      return this.currentSearchFilter.indexOf(d.cat_id) !== -1
    })

    let currentCategory = this.search.filters.reduce((sum, d) => {
      if (this.currentSearchFilter.indexOf(d.cat_id) !== -1) {
        sum.push(d.cat_name)
      }
      return sum
    }, [])

    let currentSearchCategory= currentCategory.join(', ')
    this.search.all = false

    if (this.currentSearchFilter.length === this.search.filters.length) {
      this.search.all = true
      currentSearchCategory = 'All Categories'
    }

    this.search.display = filteredSearchResult
    this.currentSearchCategory = currentSearchCategory
  }

  searchAll() {
    if (!this.search.all) {
      this.currentSearchFilter = this.search.filters.map(filter=> filter.cat_id)
      this.search.display = this.search.result.filter((d) => {
        return this.currentSearchFilter.indexOf(d.cat_id) !== -1
      })
      this.currentSearchCategory = 'All Categories'
    }
    this.search.all = !this.search.all
  }

  resetSearch() {
    this.search = {
      state: false,
      all: true,
      result: [],
      display: [],
      term: '',
      filters: []
    }

    this.currentSearchFilter = []
    this.currentSearchCategory = 'All Categories'
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
  getProductComments: action,
})


export default new ProductStore()
