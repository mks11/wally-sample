import {inject, observer} from 'mobx-react'
const connect = str => Comp => inject([str])(observer(Comp));

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const formatMoney = (n, c, d, t) => {
  var c = n % 1 != 0 ? 2 : 2,
  c = isNaN(c = Math.abs(c)) ? 0 : c, 
  d = d == undefined ? "." : d, 
  t = t == undefined ? "," : t, 
  s = n < 0 ? "-" : "", 
  i = String(parseInt(n = Math.abs(Number(n) || 0))), 
  j = (j = i.length) > 3 ? j % 3 : 0;
  var money =  '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");

  // var sep = money.split(d)
  // if (sep.length == 2) {
  //   var dec = parseFloat(money.replace('$', ''))
  //   dec = Math.abs(dec)
  //
  //   return '$'+dec
  // }

  return money
}
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  connect, validateEmail, formatMoney, capitalizeFirstLetter
}
