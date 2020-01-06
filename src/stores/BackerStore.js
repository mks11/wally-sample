import { observable, decorate, action } from "mobx";
import { GET_FAKE_BACKERS } from "../config";
import axios from "axios";

class BackerStore {
  backers = [];

  async loadBackers() {
    const res = await axios.get(GET_FAKE_BACKERS);
    this.backers = res.data;
  }
}

decorate(BackerStore, {
  backers: observable,
  loadBackers: action
});

export default new BackerStore();
