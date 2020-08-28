import { inject, observer } from 'mobx-react';
import moment from 'moment';
const connect = (str) => (Comp) => inject([str])(observer(Comp));

export const datesEqual = (aDate, bDate) => {
  const a = moment.utc(aDate).format('YYYY-MM-DD');
  const b = moment.utc(bDate).format('YYYY-MM-DD');
  return a === b;
};

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatMoney = (n, precision, d = '.', t = ',') => {
  if (isNaN((precision = Math.abs(precision)))) {
    precision = 2;
  }

  var s = n < 0 ? '-' : '';
  var i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(precision))));
  var numDigits = i.length;
  var j = numDigits > 3 ? numDigits % 3 : 0;
  var money =
    '$' +
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (precision
      ? d +
        Math.abs(n - i)
          .toFixed(precision)
          .slice(2)
      : '');

  return money;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * checkes if ts1 comes before ts2
 * @param {string} begin 'hh:mm AM/PM'
 * @param {string} end 'hh:mm AM/PM'
 */
const isValidTimeOrder = (begin, end) => {
  // if either is null, return valid for now
  if (!begin || !end) {
    return true;
  }
  const beginTime = moment(begin, 'h:mm a');
  const endTime = moment(end, 'h:mm a');
  return beginTime.isSameOrBefore(endTime);
};

// takes 'HH:MM AM' or 'HH:MM PM' as first argument
/**
 *
 * @param {*} start_time
 * @param {*} end_time
 * @param {*} intervalInMins
 * @param {*} limit
 */
function genTimePoints(start_time, end_time, intervalInMins = 0, limit = 60) {
  const result = [];
  const start = moment(start_time, 'hh:mm a');
  const end = moment(end_time, 'hh:mm a');
  result.push(start.format('LT'));
  for (let i = 0; i < limit; i++) {
    start.add(intervalInMins, 'minutes').format('LT');
    if (start.isSameOrBefore(end)) {
      result.push(start.format('LT'));
    } else {
      break;
    }
  }

  return result;
}

function sortByTimestampDes(arr, field = 'timestamp') {
  return arr.sort((a, b) => {
    if (moment(a[field]).isSame(b[field])) {
      return 0;
    }
    return moment(a[field]).isBefore(b[field]) ? 1 : -1;
  });
}

export {
  connect,
  validateEmail,
  formatMoney,
  capitalizeFirstLetter,
  isValidTimeOrder,
  sortByTimestampDes,
};
