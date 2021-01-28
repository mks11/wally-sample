import {
  sortAlphabetically,
  sortByNewness,
  sortByPrice,
} from './sorting-functions';

// Sorting Order
export const ASCENDING = 'ASCENDING';
export const DESCENDING = 'DESCENDING';

// Sorting Options
export const A_TO_Z = 'ALPHABETICAL_ASCENDING';
// TODO: Uncomment when needed.
// const Z_TO_A = 'ALPHABETICAL_DESCENDING';
export const NEWEST = 'NEWNESS_DESCENDING';
export const LOW_TO_HIGH_PRICE = 'PRICE_ASCENDING';
export const HIGH_TO_LOW_PRICE = 'PRICE_DESCENDING';

export const DEFAULT_SORTING_OPTION = A_TO_Z;

const sortingConfig = [
  {
    label: 'A-Z',
    value: A_TO_Z,
    sortingFunction: (products) => sortAlphabetically(products, ASCENDING),
  },
  {
    label: 'Newest',
    value: NEWEST,
    sortingFunction: (products) => sortByNewness(products, DESCENDING),
  },
  {
    label: 'Price (Low to High)',
    value: LOW_TO_HIGH_PRICE,
    sortingFunction: (products) => sortByPrice(products, ASCENDING),
  },
  {
    label: 'Price (High to Low)',
    value: HIGH_TO_LOW_PRICE,
    sortingFunction: (products) => sortByPrice(products, DESCENDING),
  },
];

export default sortingConfig;

export const POSSIBLE_SORTING_OPTIONS = sortingConfig.map(
  (option) => option.value,
);
