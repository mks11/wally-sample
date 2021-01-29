import React from 'react';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import SortAndFilterMenuBar from './SortAndFilterMenuBar';
import ProductList from './ProductList';

function ProductAssortment() {
  const { product } = useStores();

  return (
    <Box>
      <SortAndFilterMenuBar />
      <ProductList products={product.filteredProducts} />
    </Box>
  );
}

export default observer(ProductAssortment);
