import { observable, decorate, action } from "mobx";
import { API_GET_KICKSTARTER_BACKERS } from "../config";
import axios from "axios";

class BackerStore {
  backers = [];

  async loadBackers() {
    const res = await axios.get(API_GET_KICKSTARTER_BACKERS);
    this.backers = res.data.backers;
  }
}

decorate(BackerStore, {
  backers: observable,
  loadBackers: action
});

export default new BackerStore();
