import React from 'react'
import { PRODUCT_BASE_URL } from 'config'
import { formatMoney } from 'utils'
import { LazyLoadImage } from 'react-lazy-load-image-component'

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

  const outOfStock = product.out_of_stock
  const unavailable = false
  let availableDays = [];
  let availableDOW = [];
  const daysOfWeek = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
  if (unavailable) {
    availableDays = [0, 1, 2, 3, 4, 5, 6]
    availableDOW = availableDays.map(d => daysOfWeek[d]);
  }

  return ( 
    <div className="col-lg-3 col-md-4 col-6 col-sm-6 product-thumbnail" onClick={() => onProductClick(product.product_id, deliveryTimes)}>
      <LazyLoadImage
        alt={product.product_name || product.name}
        height={180}
        src={`${PRODUCT_BASE_URL}${product.image_refs[0]}`}
        width={200}
      />
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
      {
      }
      <div className={`product-packaged ${(outOfStock) ? 'out-of-stock' : (unavailable ? 'unavailable' : '')}`}>
        {
          outOfStock
            ? 'Out of stock'
            : (unavailable ? `Delivery days: ${availableDOW.join(', ')}` : `packed in ${product.std_packaging}`)
        }
      </div>
    </div>
  )
}

export default Product