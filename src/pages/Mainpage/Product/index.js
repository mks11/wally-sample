import React from 'react'
import { PRODUCT_BASE_URL } from 'config'
import { formatMoney } from 'utils'

const Product = props => {
  const { product, onProductClick, deliveryTimes } = props

  const producer = product.producer || null
  const price = product.product_price / 100
  const unit_type = product.price_unit
  
  let price_unit = 'per '
  if (['ea'].includes(unit_type)) {
    if (product.subcat_name) {
      price_unit += product.subcat_name  
    } else {
      price_unit += 'unit'
    }
  } else {
    price_unit += unit_type
  }

  return ( 
    <div className="col-lg-3 col-md-4 col-6 col-sm-6 product-thumbnail" onClick={() => onProductClick(product.product_id, deliveryTimes)}>
      <img src={`${PRODUCT_BASE_URL}${product.product_id}/${product.image_refs[0]}`} alt="" />
      <div className="row product-detail">
        <div className="col-3 product-price">
          {formatMoney(price)}
        </div>
        <div className="col-9 product-weight">
          {price_unit}
        </div>
      </div>
      { producer && <span className="product-producer">{producer}</span>}
      <br></br>
      { product.product_name && <span className="product-desc"><strong>{product.product_name}</strong></span>}
      { product.name && <span className="product-desc"><strong>{product.name}</strong></span>}
      <div className="product-packaged">packed in {product.packaging_type}</div>
    </div>
  )
}

export default Product