import { observable, decorate, action } from "mobx";
import { API_GET_VENDOR_PROFILE } from "../config";
import axios from "axios";

class VendorProfileStore {
  vendor = {};
  products = [];

  async loadVendorProfile(vendor_name) {
    const res = await axios.get(`${API_GET_VENDOR_PROFILE}${vendor_name}`);

    if (res.data) {
      this.vendor = res.data.vendor;
      console.log("vendor from API is");
      console.log(this.vendor)
      this.products = res.data.products;
    }

    return res.data
  }
}

decorate(VendorProfileStore, {
  vendor: observable,
  products: observable,
  loadVendorProfile: action,
  loadVendorProducts: action
});

export default new VendorProfileStore();
