import React, { lazy, Suspense } from 'react';

// MobX
import { useStores } from 'hooks/mobx';

import { Typography } from '@material-ui/core';
import { PRODUCT_BASE_URL } from 'config';
import { formatMoney } from 'utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ProductModal = lazy(() => import('modals/ProductModalV2'));

const Product = ({ product }) => {
  const { modalV2, product: productStore } = useStores();
  const outOfStock = product.out_of_stock;
  const producer = product.producer || null;
  let price_unit = 'per jar';
  const price = product.product_price / 100;

  const handleProductClick = async (product_id) => {
    try {
      await productStore.showModal(product_id, null);
      modalV2.open(
        <Suspense
          fallback={<Typography variant="h1">Loading product...</Typography>}
        >
          <ProductModal />
        </Suspense>,
        'right',
        'md',
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="col-lg-3 col-md-4 col-6 col-sm-6 product-thumbnail"
      onClick={() => handleProductClick(product.product_id)}
    >
      <LazyLoadImage
        alt={product.product_name || product.name}
        src={`${PRODUCT_BASE_URL}${product.product_id}/${product.image_refs[0]}`}
      />
      <div className="row product-detail">
        <div className="col-3 product-price">{formatMoney(price)}</div>
        <div className="col-9 product-weight">{price_unit}</div>
      </div>
      {producer && <span className="product-producer">{producer}</span>}
      <br></br>
      {product.product_name && (
        <span className="product-desc">
          <strong>{product.product_name}</strong>
        </span>
      )}
      {product.name && (
        <span className="product-desc">
          <strong>{product.name}</strong>
        </span>
      )}
      {}
      <div className={`product-packaged ${outOfStock ? 'out-of-stock' : ''}`}>
        {outOfStock ? 'Out of stock' : `packed in ${product.packaging_type}`}
      </div>
    </div>
  );
};

export default Product;
