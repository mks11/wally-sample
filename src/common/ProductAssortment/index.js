import React from 'react';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import SortAndFilterMenuBar from './SortAndFilterMenuBar';
import ProductList from './ProductList';

function ProductAssortment({ isLoading }) {
  const { product } = useStores();

  return (
    <Box>
      <SortAndFilterMenuBar />
      <ProductList isLoading={isLoading} products={product.filteredProducts} />
    </Box>
  );
}

export default observer(ProductAssortment);
