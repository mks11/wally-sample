import {
  sortAlphabetically,
  sortByNewness,
  sortByPrice,
  ASCENDING,
  DESCENDING,
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

const randomlyOrderedWithDuplicates = [
  citrusLavenderSoapBar, // Price 700,   2020-11-05T15:15:48.098Z
  laundryConcentratePaste, // Price 2150 ,  2020-11-30T16:55:05.143Z
  naturalLiquidHandSoapPeppermint, // Price 1428, 2020-10-21T17:40:12.237Z
  naturalLaundryDetergentLavender, // Price 762,  2020-10-21T17:40:11.499Z
  seaMineralsBlueIrisHandSoap, // Price 472,      2020-11-30T16:51:05.284Z
  citrusLavenderSoapBar, // Price 700,   2020-11-05T15:15:48.098Z
  naturalLiquidHandSoapPeppermint, // Price 1428, 2020-10-21T17:40:12.237Z
];

// Alphabetical Expectations
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

// Price Expectations
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

const orderedByPriceASCWhenDuplicate = [
  seaMineralsBlueIrisHandSoap,
  citrusLavenderSoapBar,
  citrusLavenderSoapBar,
  naturalLaundryDetergentLavender,
  naturalLiquidHandSoapPeppermint,
  naturalLiquidHandSoapPeppermint,
  laundryConcentratePaste,
];

const orderedByPriceDESWhenDuplicate = [
  laundryConcentratePaste,
  naturalLiquidHandSoapPeppermint,
  naturalLiquidHandSoapPeppermint,
  naturalLaundryDetergentLavender,
  citrusLavenderSoapBar,
  citrusLavenderSoapBar,
  seaMineralsBlueIrisHandSoap,
];

// Newness Expectations
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
    const result = sortAlphabetically(randomlyOrdered, ASCENDING);
    expect(result).toEqual(orderedAlphabeticallyASC);
  });

  test('#2 should order by "DESCENDING"', () => {
    const result = sortAlphabetically(randomlyOrdered, DESCENDING);
    expect(result).toEqual(orderedAlphabeticallyDES);
  });
});

describe('sortByNewness', () => {
  test('#1 should order by "ASCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, ASCENDING);
    expect(result).toEqual(orderedByNewnessASC);
  });

  test('#2 should order by "DESCENDING"', () => {
    const result = sortByNewness(randomlyOrdered, DESCENDING);
    expect(result).toEqual(orderedByNewnessDES);
  });
});

describe('sortByPrice', () => {
  test('#1 should order by "ASCENDING"', () => {
    const result = sortByPrice(randomlyOrdered, ASCENDING);

    expect(result).toEqual(orderedByPriceASC);
  });

  test('#2 should order by "DESCENDING"', () => {
    const result = sortByPrice(randomlyOrdered, DESCENDING);
    expect(result).toEqual(orderedByPriceDES);
  });

  test('#3 should order when two products have same price: case ASCENDING', () => {
    const result = sortByPrice(randomlyOrderedWithDuplicates, ASCENDING);
    expect(result).toEqual(orderedByPriceASCWhenDuplicate);
  });

  test('#4 should order when two products have same price: case DESCENDING', () => {
    const result = sortByPrice(randomlyOrderedWithDuplicates, DESCENDING);
    expect(result).toEqual(orderedByPriceDESWhenDuplicate);
  });
});
