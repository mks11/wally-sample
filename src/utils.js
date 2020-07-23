import {inject, observer} from 'mobx-react'
import ReactGA from 'react-ga'
import moment from 'moment'
const connect = str => Comp => inject([str])(observer(Comp));

export const datesEqual = (aDate, bDate) => {
  const a = moment.utc(aDate).format('YYYY-MM-DD')
  const b = moment.utc(bDate).format('YYYY-MM-DD')
  return a === b
}

export const logPageView = () => {
  console.log('Logging pageview for ${window.location.pathname}');
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export const logEvent = ({category = '', action = '', value=null, label=''} = {}) => {
  if (category && action) {
    console.log("Logging event for ", category, action, value, label);
    var GAEvent = { category: category, action: action };
    if (label) GAEvent["label"] = label;
    if (value) GAEvent["value"] = parseFloat(value);
    console.log("GAEvent is", GAEvent);
    ReactGA.event(GAEvent);
  }
}

export const logModalView = (modalPath = '') => {
  if (modalPath) {
    console.log("Logging modal view for ", modalPath);
    ReactGA.modalview(modalPath);
  }
}

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const formatNumber = (n, c, d, t) => {
  var c = n % 1 != 0 ? 2 : 2,
  c = isNaN(c = Math.abs(c)) ? 0 : c, 
  d = d == undefined ? "." : d, 
  t = t == undefined ? "," : t, 
  s = n < 0 ? "-" : "", 
  i = String(parseInt(n = Math.abs(Number(n) || 0))), 
  j = (j = i.length) > 3 ? j % 3 : 0;
  var money =  ''+ s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

  // var sep = money.split(d)
  // if (sep.length == 2) {
  //   var dec = parseFloat(money.replace('$', ''))
  //   dec = Math.abs(dec)
  //
  //   return '$'+dec
  // }

  return money
}

const formatMoney = (n, c, d, t) => {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  var money = "$" + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

  return money
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * checkes if ts1 comes before ts2
 * @param {string} begin 'hh:mm AM/PM'
 * @param {string} end 'hh:mm AM/PM'
 */
const isValidTimeOrder = (begin, end) => {
  // if either is null, return valid for now
  if (!begin || !end){
    return true
  }
  const beginTime = moment(begin,'h:mm a')
  const endTime = moment(end, 'h:mm a')
  return beginTime.isSameOrBefore(endTime)
} 


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
  const start = moment(start_time, 'hh:mm a')
  const end = moment(end_time,'hh:mm a')
  result.push(start.format('LT'))
  for (let i = 0; i < limit; i++) {
    start.add(intervalInMins,'minutes').format('LT')
    if (start.isSameOrBefore(end)){
      result.push(start.format('LT'))
    } else {
      break;
    }
  }

  return result;
}

function sortByTimestampDes(arr, field = "timestamp") {
  return arr.sort((a, b) => {
    if (moment(a[field]).isSame(b[field])) {
      return 0;
    }
    return moment(a[field]).isBefore(b[field]) ? 1 : -1;
  });
}

export {
  connect, validateEmail, formatNumber, formatMoney, capitalizeFirstLetter, genTimePoints, isValidTimeOrder,
  sortByTimestampDes
}
