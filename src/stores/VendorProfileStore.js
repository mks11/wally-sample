import { observable, decorate, action } from "mobx";
import { API_GET_VENDOR_PROFILE } from "../config";
import axios from "axios";

class VendorProfileStore {
  vendor = [];
  products = [];

  async loadVendorProfile(vendor_name) {
    const res = await axios.get(`${API_GET_VENDOR_PROFILE}${vendor_name}`);
    this.vendor = res.data.vendor;
  }

  async loadVendorProducts(vendor_name) {
    const res = await axios.get(`${API_GET_VENDOR_PROFILE}${vendor_name}`);
    this.products = res.data.products;
  }
}

decorate(VendorProfileStore, {
  vendor: observable,
  products: observable,
  loadVendorProfile: action,
  loadVendorProducts: action
});

export default new VendorProfileStore();
