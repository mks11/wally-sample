import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';

import { connect } from 'utils';

import Filters from './Filters';
import SearchBar from './SearchBar';
import CartDropdown from './CartDropdown';

class ProductTop extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.uiStore = props.store.ui;
    this.productStore = props.store.product;
    this.checkoutStore = props.store.checkout;
    this.routing = props.store.routing;
    this.modalStore = props.store.modal;

    this.state = {
      sticky: 0,
    };
  }

  componentDidMount() {
    const $ = window.$;
    const self = this;
    $(document).ready(function () {
      self.calculateSticyPosition();
    });
    $(window).bind('scroll', this.handleFixedTop);
    $(window).bind('resize', this.calculateSticyPosition);
  }

  componentWillUnmount() {
    const $ = window.$;
    $(window).unbind('scroll', this.handleFixedTop);
    $(window).unbind('resize', this.calculateSticyPosition);
  }

  calculateSticyPosition = () => {
    const element = document.getElementsByClassName('aw-header')[0];
    const newSticky = element ? element.offsetHeight : 0;
    this.setState({
      sticky: newSticky,
    });
  };

  handleFixedTop = () => {
    const $ = window.$;
    const { sticky } = this.state;
    const stickyPos = sticky;
    if (window.pageYOffset >= stickyPos) {
      $('.product-top').addClass('fixed');
    } else {
      $('.product-top').removeClass('fixed');
    }
  };

  handleCheckout = () => {
    if (this.userStore.status) {
      this.routing.push('/main/similar-products');
    } else {
      this.modalStore.toggleModal('login');
    }
  };

  handleEdit = (data) => {
    this.productStore
      .showModal(
        data.product_id,
        data.customer_quantity,
        this.userStore.getDeliveryParams(),
      )
      .then((data) => {
        this.userStore.adjustDeliveryTimes(
          data.delivery_date,
          this.checkoutStore.deliveryTimes,
        );
        this.modalStore.toggleModal('product');
      });
  };

  handleDelete = (id) => {
    this.modalStore.toggleModal('delete', id);
  };

  handleMobileSearchOpen = () => {
    const { onMobileSearchClick } = this.props;
    onMobileSearchClick && onMobileSearchClick();
  };

  handleFiltersSelect = (values) => {
    this.props.onFilterUpdate(values);
  };

  render() {
    const { onSearch } = this.props;

    return (
      <div className="product-top">
        <Container>
          <Row>
            <Col className="d-none d-lg-block col-4">
              <Filters onSelect={this.handleFiltersSelect} />
            </Col>
            <Col>
              <div className="d-flex align-items-start">
                <SearchBar onSearch={onSearch} />
                <Col xs="auto" className="d-block d-lg-none ml-auto">
                  <button
                    className="btn btn-transparent"
                    onClick={this.handleMobileSearchOpen}
                  >
                    <span className="catsearch-icon"></span>
                  </button>
                </Col>
                <Link className="d-none d-md-block ml-3" to="/main/buyagain">
                  <img src="/images/reorder.png" height="40" alt="" />
                </Link>
                <span className="d-none d-md-block">
                  <CartDropdown
                    ui={this.uiStore}
                    cart={this.checkoutStore.cart}
                    onCheckout={this.handleCheckout}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                  />
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect('store')(ProductTop);
