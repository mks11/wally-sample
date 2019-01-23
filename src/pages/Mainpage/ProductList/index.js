import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import Product from '../Product'

class ProductList extends Component {
  componentDidMount() {
    const $ = window.$

    const speed = window.innerWidth <= 500 ? '40' : '25';

    $('.big-arrow.left-arrow').click(function() {
      $(this).siblings('.container-fluid').animate({
        scrollLeft: `+=${speed}`
      }, 50, 'linear');
    })
    $('.big-arrow.right-arrow').click(function() {
      $(this).siblings('.container-fluid').animate({
        scrollLeft: `-=${speed}`
      }, 50, 'linear');
    })
  }

  render() {
    const {
      display,
      mode,
      deliveryTimes,
      onProductClick,
    } = this.props

    return (
      <div className="product">
        <h2>{display.cat_name}</h2>
        <div className="product-sub">
          <h5>{display.cat_name}</h5>
          <Link to={`/main/${display.cat_id}`}>View All {display.number_products} ></Link>
        </div>

        {mode === 'limit' && <Button className="big-arrow right-arrow" />}
        <div className="container-fluid">
          <div className={`row flex-row ${mode === 'limit' ? 'flex-nowrap' : ''}`} >
            {
              display.products.map((product, index) => (
                <Product
                  key={index}
                  product={product}
                  deliveryTimes={deliveryTimes}
                  onProductClick={onProductClick}
                />
              ))
            }
          </div>
        </div>
        {mode === 'limit' && <Button className="big-arrow left-arrow" />}
      </div>
    )
  }
}

export default ProductList