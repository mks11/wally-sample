import React from 'react';
import StockCard from './PackagingStockCard';

function getSortedPermutations(ALL_SIZES, ALL_TYPES) {
  const cards_group = ALL_SIZES.map((size) =>
    ALL_TYPES.map((type) => ({ size, type })),
  );
  return cards_group.reduce((prev, c) => {
    Array.isArray(c) ? c.every((v) => prev.push(v)) : prev.push(c);
    return prev;
  }, []);
}

export default function PackagingInventoryOverview({ stock, sizes, types }) {
  const combinations = getSortedPermutations(sizes, types);
  const getStat = (v) => stock[v.size] && stock[v.size][v.type];
  const makeTitle = (comb) =>
    comb.size + ' ' + comb.type.charAt(0).toUpperCase() + comb.type.slice(1);
  return combinations.map((comb) => {
    const stock_status = getStat(comb);
    if (!stock_status) {
      return null; // if there are combinations for which data doesn't exists, this is to not show the empty card
    }
    return (
      <StockCard
        key={comb.type + comb.size}
        title={makeTitle(comb)}
        stat={stock_status}
        elevation={3}
      />
    );
  });
}
