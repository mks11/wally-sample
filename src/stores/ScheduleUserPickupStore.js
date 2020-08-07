import { observable, decorate, action } from "mobx";
import { API_SCHEDULED_PICKUP } from "../config";
import axios from "axios";

class UserPickupStore {
  loading = false;

  async schedulePickupAsync({
    address_id,
    scheduled_date,
    earliest_time,
    latest_time,
    pickup_notes,
    auth
  }) {
    this.loading = true;

    const res = await axios.post(
      API_SCHEDULED_PICKUP,
      {
        address_id,
        scheduled_date,
        earliest_time,
        latest_time,
        pickup_notes
      },
      auth
    );

    this.loading = false;
    return res.data;
    // return 200
  }
}

decorate(UserPickupStore, {
  loading: observable,
  schedulePickupAsync: action
});

export default new UserPickupStore();
