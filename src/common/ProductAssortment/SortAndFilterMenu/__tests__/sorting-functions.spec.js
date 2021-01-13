import {
  sortAlphabetically,
  sortByNewness,
  sortByPrice,
} from './../sorting-functions';

import {
  citrusLavenderSoapBar,
  laundryConcentratePaste,
  naturalLiquidHandSoapPeppermint,
  naturalLaundryDetergentLavender,
  seaMineralsBlueIrisHandSoap,
} from 'testing-resources/fixtures/products';

const randomlyOrdered = [
  citrusLavenderSoapBar, // Price 700,   2020-11-05T15:15:48.098Z
  laundryConcentratePaste, // Price 2150 ,  2020-11-30T16:55:05.143Z
  naturalLiquidHandSoapPeppermint, // Price 1428, 2020-10-21T17:40:12.237Z
  naturalLaundryDetergentLavender, // Price 762,  2020-10-21T17:40:11.499Z
  seaMineralsBlueIrisHandSoap, // Price 472,      2020-11-30T16:51:05.284Z
];

const orderedAlphabeticallyASC = [
  citrusLavenderSoapBar,
  laundryConcentratePaste,
  naturalLaundryDetergentLavender,
  naturalLiquidHandSoapPeppermint,
  seaMineralsBlueIrisHandSoap,
];
const orderedAlphabeticallyDES = [
  seaMineralsBlueIrisHandSoap,
  naturalLiquidHandSoapPeppermint,
  naturalLaundryDetergentLavender,
  laundryConcentratePaste,
  citrusLavenderSoapBar,
];
const orderedByPriceASC = [
  seaMineralsBlueIrisHandSoap,
  citrusLavenderSoapBar,
  naturalLaundryDetergentLavender,
  naturalLiquidHandSoapPeppermint,
  laundryConcentratePaste,
];
const orderedByPriceDES = [
  laundryConcentratePaste,
  naturalLiquidHandSoapPeppermint,
  naturalLaundryDetergentLavender,
  citrusLavenderSoapBar,
  seaMineralsBlueIrisHandSoap,
];
const orderedByNewnessASC = [
  naturalLaundryDetergentLavender,
  naturalLiquidHandSoapPeppermint,
  citrusLavenderSoapBar,
  seaMineralsBlueIrisHandSoap,
  laundryConcentratePaste,
];
const orderedByNewnessDES = [
  laundryConcentratePaste,
  seaMineralsBlueIrisHandSoap,
  citrusLavenderSoapBar,
  naturalLiquidHandSoapPeppermint,
  naturalLaundryDetergentLavender,
];

describe('sortAlphabetically', () => {
  test('#1 should order by "ASCENDING"', () => {
    const result = sortAlphabetically(randomlyOrdered, 'ASCENDING');
    expect(result).toEqual(orderedAlphabeticallyASC);
  });
  test('#2 should order by "DESCENDING"', () => {
    const result = sortAlphabetically(randomlyOrdered, 'DESCENDING');
    expect(result).toEqual(orderedAlphabeticallyDES);
  });

  test('#3 should not be order by "DESCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, 'ASCENDING');
    expect(result).not.toEqual(orderedAlphabeticallyDES);
  });
});
describe('sortByNewness', () => {
  test('#1 should order by "ASCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, 'ASCENDING');
    expect(result).toEqual(orderedByNewnessASC);
  });
  test('#2 should order by "DESCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, 'DESCENDING');
    expect(result).toEqual(orderedByNewnessDES);
  });

  test('#3 should not be order by "DESCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, 'ASCENDING');
    expect(result).not.toEqual(orderedByNewnessDES);
  });
});
describe('sortByPrice', () => {
  test('#1 should order by "ASCENDING"', () => {
    const result = sortByPrice(randomlyOrdered, 'ASCENDING');

    expect(result).toEqual(orderedByPriceASC);
  });
  test('#2 should order by "DESCENDING"', () => {
    const result = sortByPrice(randomlyOrdered, 'DESCENDING');
    expect(result).toEqual(orderedByPriceDES);
  });

  test('#3 should not be order by "DESCENDING"', () => {
    const result = sortByPrice(randomlyOrdered, 'DESCENDING');
    expect(result).not.toEqual(orderedByPriceASC);
  });
});
