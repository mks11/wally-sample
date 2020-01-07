import { observable, decorate, action } from "mobx";
import { API_GET_VENDOR_PROFILE } from "../config";
import axios from "axios";

class VendorProfileStore {
  async loadVendorProfile(id) {
    const res = await axios.get(`${API_GET_VENDOR_PROFILE}/${id}`);
    await this.setState({
      vendor_name: res.data
    });
  }
}

decorate(VendorProfileStore, {
  vendor: observable,
  loadVendorProfile: action
});

export default new VendorProfileStore();
