import { observable, decorate, action } from "mobx";
import { API_POST_METRIC_SOURCE } from "../config";
import axios from "axios";

class MetricStore {
  async triggerAudienceSource(src) {
    const res = await axios.get(`${API_POST_METRIC_SOURCE}?src=${src}`);
    return res.data
  }

}

// decorate(MetricStore, {
// });

export default new MetricStore();
