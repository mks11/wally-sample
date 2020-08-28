import moment from 'moment';

export function getEndOfDay() {
  return moment().utc().endOf('d').toDate();
}
