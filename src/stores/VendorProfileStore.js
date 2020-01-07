import { observable, decorate, action } from "mobx";
import { API_GET_VENDOR_PROFILE } from "../config";
import axios from "axios";

class VendorProfileStore {
  vendor = [];

  async loadVendorProfile(vendor_name) {
    const res = await axios.get(`${API_GET_VENDOR_PROFILE}${vendor_name}`);
    this.vendor = res.data;
  }
}

decorate(VendorProfileStore, {
  vendor: observable,
  loadVendorProfile: action
});

export default new VendorProfileStore();
