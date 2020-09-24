import React from 'react';
import { PRODUCT_BASE_URL } from 'config';
import { formatMoney } from 'utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Product = (props) => {
  const { product, onProductClick, deliveryTimes } = props;
  const producer = product.producer || null;
  const price = product.product_price / 100;

  let price_unit = 'per jar';

  const outOfStock = product.out_of_stock;
  return (
    <div
      className="col-lg-3 col-md-4 col-6 col-sm-6 product-thumbnail"
      onClick={() => onProductClick(product.product_id, deliveryTimes)}
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
