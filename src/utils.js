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

function sortByTimestampDes(arr, field = 'timestamp') {
  return arr.sort((a, b) => {
    if (moment(a[field]).isSame(b[field])) {
      return 0;
    }
    return moment(a[field]).isBefore(b[field]) ? 1 : -1;
  });
}

function getItemsCount(items) {
  let count = 0;
  for (let i = items.length - 1; i >= 0; i--) {
    count += items[i].customer_quantity;
  }
  return count;
}

export {
  connect,
  validateEmail,
  formatMoney,
  capitalizeFirstLetter,
  isValidTimeOrder,
  sortByTimestampDes,
  getItemsCount,
};
