import { sortByTimestampDes } from 'utils';
import { ASCENDING } from './sorting-config';

export function sortAlphabetically(products, order = ASCENDING) {
  return [...products].sort((p1, p2) => {
    if (p1.name > p2.name) {
      return order === ASCENDING ? 1 : -1;
    } else if (p1.name < p2.name) {
      return order === ASCENDING ? -1 : 1;
    } else {
      return 0;
    }
  });
}

export function sortByNewness(products, order = ASCENDING) {
  const sortedDesOrder = sortByTimestampDes(products, 'createdAt') || [];
  return order === ASCENDING
    ? sortedDesOrder.reverse()
    : sortByTimestampDes(products, 'createdAt');
}

export function sortByPrice(products, order = ASCENDING) {
  return [...products].sort((p1, p2) => {
    const diff = p1.inventory[0].price - p2.inventory[0].price;
    if (diff > 0) {
      return order === ASCENDING ? 1 : -1;
    } else if (diff < 0) {
      return order === ASCENDING ? -1 : 1;
    } else {
      return 0;
    }
  });
}
