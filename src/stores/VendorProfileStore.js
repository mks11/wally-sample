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
      this.products = res.data.products;

      if (!this.vendor.length) {
        this.vendor = {
          logo_url: '/images/logo.png',
          description: 'One of our responsible, sustainable vendors.',
        }
      }
    }

    return res.data
  }

  hasVendorProfile() {
    return Object.entries(this.vendor).length !== 0
  }
}

decorate(VendorProfileStore, {
  vendor: observable,
  products: observable,
  loadVendorProfile: action,
  loadVendorProducts: action,
  hasVendorProfile: action,
});

export default new VendorProfileStore();
