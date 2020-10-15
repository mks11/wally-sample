import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';

import { connect } from 'utils';

import Filters from './Filters';
import SearchBar from './SearchBar';

class ProductTop extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.uiStore = props.store.ui;
    this.productStore = props.store.product;
    this.checkoutStore = props.store.checkout;
    this.routing = props.store.routing;
    this.modalStore = props.store.modal;
  }

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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect('store')(ProductTop);
