import { observable, decorate, action } from 'mobx';
import { GET_ZIP_CODES, API_SUBSCRIBE_NOTIFICATIONS } from '../config';
import axios from 'axios';

class ZipStore {
  zipcodes = [];
  selectedZip = null;
  zip = null;

  async loadZipCodes() {
    const res = await axios.get(GET_ZIP_CODES);
    this.zipcodes = res.data.zipcodes;
  }

  validateZipCode(zip) {
    const valid = this.zipcodes.find((z) => z === zip);
    if (valid) return true;
    return false;
  }

  async subscribeNotifications(data) {
    const res = await axios.post(API_SUBSCRIBE_NOTIFICATIONS, data);
    return res.data;
  }

  setZip(zip) {
    this.zip = zip;
    localStorage.setItem('zip', JSON.stringify(zip));
  }
}

decorate(ZipStore, {
  zipcodes: observable,
  selectedZip: observable,
  loadZipCodes: action,
  setZip: action,
});

export default new ZipStore();
