import { observable, decorate, action } from "mobx";
import { API_SCHEDULED_PICKUP } from "../config";

import axios from "axios";

class UserPickupStore {
  async schedulePickup(
    address_id,
    scheduled_date,
    earliest_time,
    latest_time,
    pickup_notes
  ) {
    const resp = await axios.post(API_SCHEDULED_PICKUP, {
      address_id,
      scheduled_date,
      earliest_time,
      latest_time,
      pickup_notes
    });
  }
}

decorate(UserPickupStore, {
  schedulePickup: action
});

export default new UserPickupStore();
