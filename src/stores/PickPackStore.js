import { decorate, observable, action } from 'mobx';
import moment from 'moment';

class PickPackStore {
  // Defaults to today's date
  selectedDate = moment().utc().startOf('d').toISOString();

  setSelectedDate(date) {
    this.selectedDate = moment(date).utc().startOf('d').toISOString();
  }
}

decorate(PickPackStore, {
  selectedDate: observable,
  setSelectedDate: action,
});

export default new PickPackStore();
