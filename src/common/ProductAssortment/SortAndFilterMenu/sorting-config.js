import {
  sortAlphabetically,
  sortByNewness,
  sortByPrice,
} from './sorting-functions';

const sortingConfig = [
  {
    label: 'A-Z',
    value: 'alphabetical',
    sortingFunction: (products) => sortAlphabetically(products, 'ASCENDING'),
  },
  {
    label: 'Newest',
    value: 'newest',
    sortingFunction: (products) => sortByNewness(products, 'DESCENDING'),
  },
  {
    label: 'Price (Low to High)',
    value: 'priceLowToHigh',
    sortingFunction: (products) => sortByPrice(products, 'ASCENDING'),
  },
  {
    label: 'Price (High to Low)',
    value: 'priceHighToLow',
    sortingFunction: (products) => sortByPrice(products, 'DESCENDING'),
  },
];

export default sortingConfig;
