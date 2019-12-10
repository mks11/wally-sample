import { observable, decorate, action } from "mobx";
import {
  API_ADMIN_GET_TIME_FRAMES,
  API_ADMIN_GET_SHOP_ITEMS,
  API_ADMIN_GET_SHOP_ITEMS_FARMS,
  API_ADMIN_GET_UNAVAILABLE_SHOP_ITEMS,
  API_ADMIN_GET_SUB_INFO,
  API_ADMIN_UPDATE_DAILY_SUBSTITUTE,
  API_ADMIN_UPDATE_SHOP_ITEM,
  API_ADMIN_SET_SHOP_ITEM_STATUS,
  API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS,
  API_ADMIN_GET_LOCATION_STATUS,
  API_ADMIN_GET_SHOPPER_PACKAGING_INFO,
  API_ADMIN_GET_ROUTES,
  API_ADMIN_UPDATE_ROUTE_PLACEMENT,
  API_ADMIN_GET_ORDER,
  API_ADMIN_GET_PACKAGINGS,
  API_ADMIN_LINK_PACKAGING,
  API_ADMIN_PACKAGE_ORDER,
  API_ADMIN_COMPLETE_ORDER,
  API_ADMIN_POST_BLOG_POST,
  API_ADMIN_GET_SHOP_LOCATIONS,
  API_ADMIN_GET_RECEIPTS,
  API_ADMIN_POST_RECEIPT,
  API_ADMIN_GET_PRODUCT_SELECTION_DOWNLOAD,
  API_EDIT_CART_ITEM,
  API_ADMIN_CREATE_COURIER,
  API_ADMIN_GET_PURCHASED_SHOP_ITEMS,
  API_ADMIN_UPDATE_PURCHASED_SHOP_ITEM,
  API_ADMIN_GET_ORDERS,
  API_ADMIN_UPLOAD_SELECTION,
  API_ADMIN_GET_INBOUND_PROD_SHIPMENTS,
  API_ADMIN_GET_OUTBOUND_PROD_SHIPMENTS,
  API_ADMIN_UPDATE_PRODUCT_SHIPMENT,
  API_ADMIN_GET_CO_PACKING_RUNS,
  API_UPDATE_SKU_UNIT_WEIGHT,
  API_UPLOAD_COPACKING_QR_CODES,
  API_GET_UPC_INFO,
} from "../config";
import axios from "axios";
import moment from "moment";
import S3 from "aws-s3";

class AdminStore {
  timeframes = [];
  locations = [];
  receipts = [];

  shopitems = [];
  shopitemsFarms = [];
  locationStatus = {};
  packagingCounts = {};
  availableSubs = [];
  dailySubstitute = {};

  selectedSubs = [];
  checked = {};

  routes = [];
  orders = [];
  singleorder = {};

  packagings = [];

  loading = false;

  async getDailyReceipts(timeframe) {
    const res = await axios.get(
      `${API_ADMIN_GET_RECEIPTS}?timeframe=${timeframe}`
    );
    const sortedReceipts = res.data.receipts.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    this.receipts = sortedReceipts;
  }

  async uploadReceipt(date, file, shop_location) {
    // S3 Configuration
    const config = {
      bucketName: "the-wally-shop-app",
      dirName: `daily-receipts/${moment().format("YYYY[-]MM[-]DD")}`,
      region: "us-east-2",
      accessKeyId: "AKIAJVL4SVXQNCJJWRMA",
      secretAccessKey: "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"
    };
    const S3Client = new S3(config);
    let uploaded = false;
    let res;
    // Upload File to S3
    try {
      let data = await S3Client.uploadFile(file)
      console.log(data.key.split("/").slice(-1).join("/"))
      let res = await axios.post(`${API_ADMIN_POST_RECEIPT}`, {
        shop_date: date,
        filename: data.key
          .split("/")
          .slice(-1)
          .join("/"),
        location: shop_location
      });
      uploaded = true
    } catch (error) {
      console.error(error)
    }
    return uploaded;
  }

  async getTimeFrames() {
    const time = moment().format("YYYY-MM-DD HH:mm:ss");
    // const time = '2018-11-04 15:30:00'
    const res = await axios.get(`${API_ADMIN_GET_TIME_FRAMES}?time=${time}`);
    this.timeframes = res.data.timeframes;
  }

  async getShopLocations(timeframe) {
    const res = await axios.get(
      `${API_ADMIN_GET_SHOP_LOCATIONS}?timeframe=${timeframe}`
    );
    this.locations = res.data.locations;
  }

  async getShopItems(timeframe, shop_location) {
    const res = await axios.get(
      `${API_ADMIN_GET_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`
    );
    this.shopitems = res.data.shop_items;
  }

  async getPurchasedShopItems(auth, timeframe, shop_location) {
    const res = await axios.get(
      `${API_ADMIN_GET_PURCHASED_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`, auth
    );
    this.shopitems = res.data.shop_items;
  }

  async getShopItemsFarms(timeframe, shop_location) {
    const res = await axios.get(
      `${API_ADMIN_GET_SHOP_ITEMS_FARMS}?timeframe=${timeframe}&shop_location=${shop_location}`
    );
    this.shopitemsFarms = res.data.farms;
  }

  async getUnavailableShopItems(auth, timeframe, shop_location) {
    const res = await axios.get(`${API_ADMIN_GET_UNAVAILABLE_SHOP_ITEMS}?timeframe=${timeframe}&shop_location=${shop_location}`, auth)
    this.shopitems = res.data.shop_items;
  }

  async getSubInfo(shopitem_id, delivery_date, location) {
    const res = await axios.get(
      `${API_ADMIN_GET_SUB_INFO}/${shopitem_id}?delivery_date=${delivery_date}&shop_location=${location}`
    );
    this.availableSubs = res.data.available_substitutes;
    this.selectedSubs = [];
    this.checked = {};
  }

  async updateDailySubstitute(timeframe, shopitem_id, data) {
    const res = await axios.patch(
      `${API_ADMIN_UPDATE_DAILY_SUBSTITUTE}/${shopitem_id}?timeframe=${timeframe}`,
      { substitutes: data }
    );
    // unsure if response data will be in res.data or res.data.daily_substitute
    this.dailySubstitute = res.data;
  }

  async getLocationStatus(timeframe) {
    const res = await axios.get(
      `${API_ADMIN_GET_LOCATION_STATUS}?timeframe=${timeframe}`
    );
    this.locationStatus = res.data.location_status;
  }

  async getShopperPackagingInfo(timeframe, shop_location) {
    const res = await axios.get(
      `${API_ADMIN_GET_SHOPPER_PACKAGING_INFO}?timeframe=${timeframe}&shop_location=${shop_location}`
    );
    this.packagingCounts = res.data.packaging_counts;
  }

  async getProductSelectionDownload() {
    await axios.get(`${API_ADMIN_GET_PRODUCT_SELECTION_DOWNLOAD}`);
  }

  async getOutboundProductShipments() {
    const res = axios.get(`${API_ADMIN_GET_OUTBOUND_PROD_SHIPMENTS}`);
    console.log(res);
    // let response = [
    //   {
    //     shipmentId: "ABCD123",
    //     address: "101 New York Drive, NY NY 12345",
    //     carrier: "UPS",
    //     tracking_number: "12j03cd",
    //     Products: [
    //       { name: "Brown Lentils", jar_quantity: 5, case_quantity: 3 },
    //       { name: "Grey Lentils", jar_quantity: 3, case_quantity: 1 },
    //       { name: "Jemima Lentils", jar_quantity: 4, case_quantity: 9 }
    //     ],
    //     packing_list_url: "https://ups.com"
    //   },
    //   {
    //     shipmentId: "ABCD456",
    //     address: "211 Brooklyn Drive, NY NY 12345",

    //     carrier: "Fed Ex",
    //     tracking_number: "zz82hnodo",
    //     Products: [
    //       { name: "Green Lentils", jar_quantity: 5, case_quantity: 3 },
    //       { name: "Red Lentils", jar_quantity: 3, case_quantity: 1 },
    //       { name: "Blue Lentils", jar_quantity: 6, case_quantity: 9 }
    //     ],
    //     packing_list_url: "https://ups.com"
    //   },
    //   {
    //     shipmentId: "ABCD789",
    //     address: "211 Brooklyn Drive, NY NY 12345",

    //     carrier: null,
    //     tracking_number: null,
    //     Products: [
    //       { name: "Green Lentils", jar_quantity: 5, case_quantity: 3 },
    //       { name: "Red Lentils", jar_quantity: 3, case_quantity: 1 },
    //       { name: "Blue Lentils", jar_quantity: 6, case_quantity: 9 }
    //     ],
    //     packing_list_url: "https://ups.com"
    //   }
    // ];
    return res;
  }

  async updateProductShipment(id, newItem) {
    const data = { ...newItem };
    const res = axios.patch(`${API_ADMIN_UPDATE_PRODUCT_SHIPMENT}${id}`, data);

    return res;
  }

  async getInboundProductShipments() {
    const res = await axios.get(`${API_ADMIN_GET_INBOUND_PROD_SHIPMENTS}`);
    //:::: remove this test data after api implemented ::::
    // let shipment = [
    //   {
    //     from_address: {
    //       name: "Vendor A"
    //     },
    //     edd: "2019-12-06",
    //     type: "Pallet",
    //     delivery_window: "10:00-12:00",
    //     packingList: [
    //       { name: "Brown Lentils", volume: 5, process: "Dried Bulk" },
    //       { name: "Grey Lentils", volume: 3, process: "Dried Bulk (Allergen)" },
    //       { name: "Maple Syrup", volume: 4, process: "Liquid" }
    //     ]
    //   },
    //   {
    //     from_address: {
    //       name: "Vendor B"
    //     },
    //     edd: "2019-12-03",
    //     type: "Package",
    //     delivery_window: "11:00-1:00",
    //     packingList: [
    //       { name: "Blue Lentils", volume: 5, process: "Dried Bulk" },
    //       { name: "Grey Beans", volume: 1, process: "Dried Bulk (Non GMO)" },
    //       { name: "Agave Syrup", volume: 2, process: "Liquid" }
    //     ]
    //   },
    //   {
    //     from_address: {
    //       name: "Vendor C"
    //     },
    //     edd: "2019-12-07",
    //     type: "Freight",
    //     delivery_window: "9:00-1:00",
    //     packingList: [
    //       { name: "Purple Lentils", volume: 15, process: "Dried Bulk" },
    //       { name: "Rainbow Beans", volume: 3, process: "Dried Bulk" },
    //       { name: "Honey", volume: 8, process: "Liquid" }
    //     ]
    //   }
    // ];
    // const res = shipment;
    return res;
  }

  async uploadSelection(filename, formData) {
    const res = await axios.post(`${API_ADMIN_UPLOAD_SELECTION}?filename=${filename}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  async updateShopItem(timeframe, shopitem_id, data, updateCurrentProduct, index) {
    this.loading = true;
    const res = await axios.patch(
      `${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}?timeframe=${timeframe}`,
      data
    );
    if (res.data.shopItem) updateCurrentProduct(res.data.shopItem, index);
    this.updateStoreShopItem(shopitem_id, res.data);
  }

  async updatePurchasedShopItem(timeframe, shopitem_id, data, updateCurrentProduct, index) {
    this.loading = true;
    const res = await axios.patch(
      `${API_ADMIN_UPDATE_PURCHASED_SHOP_ITEM}/${shopitem_id}?timeframe=${timeframe}`,
      data
    );
    this.loading = false;
    if (res.data.shopItem) updateCurrentProduct(res.data.shopItem, index);
    this.updateStoreShopItem(shopitem_id, res.data);
  }

  async updateShopItemQuantity(timeframe, shopitem_id, data) {
    const res = await axios.patch(`${API_ADMIN_UPDATE_SHOP_ITEM}/${shopitem_id}/quantity?timeframe=${timeframe}`, data);
    this.updateStoreShopItem(shopitem_id, res.data);
  }

  async setShopItemStatus(auth, shopitem_id, status, location, quantity) {
    const res = await axios.patch(
      `${API_ADMIN_SET_SHOP_ITEM_STATUS}/${shopitem_id}?status=${status}&shop_location=${location}&quantity=${quantity}`,
      {},
      auth
    );
    res.data.user_checked = true;
    this.updateStoreShopItem(shopitem_id, res.data);
  }

  async updateShopItemsWarehouseLocations(data) {
    const res = await axios.patch(
      `${API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS}`,
      data
    );
    this.updateManyStoreShopItems(res.data);
  }

  async getRoutes(timeframe, options) {
    this.routes = [];
    const res = await axios.get(
      `${API_ADMIN_GET_ROUTES}?timeframe=${timeframe}`,
      options
    );
    this.orders = [];
    this.routes = res.data;
    return res.data;
  }

  async getRouteOrders(id, timeframe, options) {
    timeframe = moment().format("YYYY-MM-DD");
    const { data } = await axios.get(
      `${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/orders?route_id=${id}&timeframe=${timeframe ? timeframe : ""}%202:00-8:00PM`,
      options
    );

    this.orders = data;
    return data;
  }

  async getOrders(timeframe, options) {
    timeframe = moment().format("YYYY-MM-DD");

    const { data } = await axios.get(
      `${API_ADMIN_GET_ORDERS}?timeframe=${timeframe ? timeframe : ""}%202:00-8:00PM`,
      options
    );
    this.orders = data;
    return data;
  }

  async updateRoutePlacement(id, params, options) {
    const { data } = await axios.patch(
      `${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/${id}/placement`,
      params,
      options
    );
    this.updateRouteItem(id, data);
    return data;
  }

  async assignCourier(id, params, options) {
    const { data } = await axios.patch(
      `${API_ADMIN_UPDATE_ROUTE_PLACEMENT}/${id}/assign`,
      params,
      options
    );
    return data;
  }

  async createNewCourier(params, options) {
    const { data } = await axios.post(
      `${API_ADMIN_CREATE_COURIER}`,
      params,
      options,
    );
    return data;
  }

  async getOrder(id, options) {
    this.singleorder = {};
    const res = await axios.get(`${API_ADMIN_GET_ORDER}/${id}`, options);
    this.singleorder = res.data;
  }

  async getPackagings() {
    this.packagings = [];
    const res = await axios.get(`${API_ADMIN_GET_PACKAGINGS}`);
    this.packagings = res.data;
  }

  async linkPackaging(data, options) {
    this.packagings = [];
    const res = await axios.patch(`${API_ADMIN_LINK_PACKAGING}`,
      data,
      options);
    console.log(res.data);
    return res.data;
  }

  async packageOrder(id, data, options) {

    const res = await axios.patch(
      `${API_ADMIN_PACKAGE_ORDER}/${id}/package`,
      data,
      options
    ); // API_CREATE_ORDER
    console.log(res.data);
    this.updateOrderItem(id, res.data);
  }

  async completeOrder(id, data, options) {

    const res = await axios.patch(
      `${API_ADMIN_COMPLETE_ORDER}/${id}/complete`,
      data,
      options
    ); // API_CREATE_ORDER
    this.updateOrderItem(id, res.data);
  }

  async postBlogPost(data) {
    const res = await axios.post(API_ADMIN_POST_BLOG_POST, data);
    console.log(res.data);
  }


  async getCopackingRuns() {
    const res = await axios.get(API_ADMIN_GET_CO_PACKING_RUNS);
    return res.data;
  }

  async getCopackingRunProducts(runId) {
    const res = await axios.get(`${API_ADMIN_GET_CO_PACKING_RUNS}/${runId}`);
    return res.data;
  }

  async updateSKUUnitWeight(skuId, data) {
    const res = await axios.post(`${API_UPDATE_SKU_UNIT_WEIGHT}/${skuId}/weight`, data);
    return res.data;
  }

  async uploadCopackingQRCodes(data) {
    const res = await axios.post(API_UPLOAD_COPACKING_QR_CODES, data);
    return res.data;
  }

  async getUPCInfo(data) {
    const res = await axios.post(API_GET_UPC_INFO, data);
    return res.data;
  }

  setEditing(id, edit) {
    for (let item of this.shopitems) {
      if (item.product_id === id) {
        item.complete = !edit;
        break;
      }
    }
  }

  updateStoreShopItem(id, updateditem) {
    this.shopitems = this.shopitems.map(item => {
      if (item._id === id) {
        item = updateditem;
      }
      return item;
    });
  }

  updateRouteItem(id, updateditem) {
    this.routes = this.routes.map(item => {
      if (item.id === id) {
        item = updateditem;
      }
      return item;
    });
  }

  updateOrderItem(id, updateditem) {
    this.orders = this.orders.map(item => {
      if (item._id === id) {
        item = updateditem;
      }
      return item;
    });
  }

  updateManyStoreShopItems(shopitems) {
    for (let item of shopitems) {
      const id = item.product_id;
      this.updateStoreShopItem(id, item);
    }
  }

  clearStoreShopItems() {
    this.shopitems = [];
  }

  clearStoreLocations() {
    this.locations = [];
  }

  clearStoreSubs() {
    this.availableSubs = [];
  }
}

decorate(AdminStore, {
  timeframes: observable,
  locations: observable,
  receipts: observable,
  shopitems: observable,
  shopitemsFarms: observable,
  locationStatus: observable,
  packagingCounts: observable,
  availableSubstitutes: observable,
  routes: observable,
  orders: observable,
  singleorder: observable,
  packagings: observable,
  blogposts: observable,

  getTimeFrames: action,
  getShopLocations: action,
  getShopItems: action,
  getShopItemsFarms: action,
  getDailyReceipts: action,
  getUnavailableShopItems: action,
  getSubInfo: action,
  getOutboundProductShipments: action,
  getInboundProductShipments: action,
  updateDailySubstitute: action,
  updateShopItem: action,
  updateShopItemsWarehouseLocations: action,
  setShopItemStatus: action,
  getLocationStatus: action,
  getShopperPackagingInfo: action,
  getRoutes: action,
  getRouteOrders: action,
  updateRoutePlacement: action,
  getOrder: action,
  getPackagings: action,
  packageOrder: action,
  completeOrder: action,
  postBlogPost: action,
  uploadReceipt: action,
  getCopackingRuns: action,
  getCopackingRunProducts: action,
  updateSKUUnitWeight: action,
  uploadCopackingQRCodes: action,
  getUPCInfo: action,
});

export default new AdminStore();
