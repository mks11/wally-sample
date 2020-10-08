import React from 'react';
import { useStores } from 'hooks/mobx';
import ProductList from './ProductList';

function ProductAssortment() {
  const { product } = useStores();
  if (!product.filteredProducts.length) {
    return null;
  }

  return <ProductList products={product.filteredProducts} />;
}

export default ProductAssortment;
