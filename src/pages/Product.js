import React, { Component } from 'react';
import Title from '../common/page/Title'
import { APP_URL } from '../config'

import ProductModal from '../common/ProductModal';

class ProductThumbnail extends Component {
  
  constructor(props){
    super(props)

   
  }


  render () { 
      return (
      <div className="col-lg-3 col-md-4 col-sm-6 product-thumbnail" >
        <img src={APP_URL + "images/product_thumbnail.png"} />
        <div className="row product-detail">
          <div className="col-6 product-price">
            $2.99
          </div>
          <div className="col-6 product-weight">
            12 oz
          </div>
        </div>
        <span className="product-desc"> Hillside farms almond milk</span>
      </div>
    )
  }
}

const ProductList = ({}) => (
  <div className="product">
    <h2>Dairy</h2>
    <div className="product-sub">
      <h5>Dairy</h5>
      <a href="#">View All 27 ></a>
    </div>

    <div className="row">
      <ProductThumbnail />
      <ProductThumbnail />
      <ProductThumbnail />
      <ProductThumbnail />
    </div>
  </div>
)

class Product extends Component {

  constructor(props){
    super(props)

    this.state = {
      isOpen: this.props.isOpen
    }
  }

  renderModal(){
    return (<ProductModal isOpen={this.state.isOpen} />)
  }

  render() {
    return (
      <div className="App">
        {/* { this.renderModal() } */}

        {/* Product Top */}
        <div className="product-top">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-4 left-column">
                <h3>All Categories <i className="fa fa-chevron-down"></i></h3>
              </div>
              <div className="col-md-9 col-sm-8 right-column">
                <div className="media">
                  <div className="media-body">
                    <div className="input-group search-product">
                      <div className="input-group-prepend">
                        <div className="input-group-text"><i className="fa fa-search"></i></div>
                      </div>
                      <input type="text" className="form-control" placeholder="Search for anything..." />
                    </div>
                  </div>
                  <div className="media-right">
                    <div className="product-cart-counter">
                      <i className="fa fa-shopping-bag"></i><span>0 Item</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* product content */}

        <div className="product-content">
          <div className="container">
            <div className="row ">
              <div className="col-md-3 col-sm-4">
                <div className="product-content-left">
                  <div className="mb-4">
                    <h4>The Wally Shop</h4>
                    <ul>
                      <li>About</li>
                      <li>Help</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-4 text-violet">All Categories</h4>
                    <h4>Grocery</h4>
                    <ul>  
                      <li>Snack</li>
                      <li>Beverages</li>
                      <li>Canned</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4>Fresh Produce</h4>
                    <ul>
                      <li>Fruits</li>
                      <li>Vegetables</li>
                      <li>Seafood</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4>Perishables</h4>
                    <ul>
                      <li>Meat & Seafood</li>
                      <li>Prepared Foods</li>
                      <li>Yogurt</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4>Healthcare & Beauty</h4>
                    <ul>
                      <li>Soap</li>
                      <li>Skincare</li>
                    </ul>
                  </div>

                  <div>
                    <img src={APP_URL + "images/shop_banner_1.png"} />
                  </div>
                </div>

              </div>

              <div className="col-md-9 col-sm-8 product-content-right">
                <img src={APP_URL + "images/shop_banner_2.png"} className="img-fluid" />

                <div className="product-breadcrumb">
                  <span>All Categories > </span>
                  <a href="">Grocery</a>
                </div>

                <ProductList />
                <ProductList />
                <ProductList />

                
              </div>
            </div>
          </div>
        </div>

    
      </div>
    );
  }
}

export default Product;
