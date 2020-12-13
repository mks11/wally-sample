import React, { Component, lazy, Suspense } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { SearchIcon } from 'Icons';
import { logEvent } from 'services/google-analytics';
import { connect } from 'utils';
import { Typography } from '@material-ui/core';

const ProductModalV2 = lazy(() => import('modals/ProductModalV2'));
class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.modalV2Store = props.store.modalV2;
    this.uiStore = props.store.ui;
    this.userStore = props.store.user;
    this.productStore = props.store.product;

    this.state = {
      searchAhead: [],
      searchAheadLoading: false,
    };
  }

  search = (keyword) => {
    this.uiStore.hideBackdrop();

    if (!keyword.length) {
      this.productStore.resetSearch();
      return;
    }
    logEvent({ category: 'Search', action: 'SearchKeyword', label: keyword });

    this.productStore.searchKeyword(
      keyword,
      this.userStore.getDeliveryParams(),
      this.userStore.getHeaderAuth(),
    );
  };

  handleSearch = (keyword) => {
    this.setState({ searchAheadLoading: true });
    this.productStore
      .searchKeyword(
        keyword,
        this.userStore.getDeliveryParams(),
        this.userStore.getHeaderAuth(),
      )
      .then((data) => {
        this.userStore.adjustDeliveryTimes(
          data.delivery_date,
          this.state.deliveryTimes,
        );
        this.setState({
          searchAhead: data.products,
          searchAheadLoading: false,
        });
      });
  };

  handleSearchSubmit = (e) => {
    if (e.keyCode === 13) {
      const instance = this._typeahead.getInstance();
      instance.blur();
      this.search(e.target.value);
    }
  };

  handleSelected = (results) => {
    if (results && results.length) {
      const instance = this._typeahead.getInstance();
      instance.blur();
      this.productStore.showModal(results[0].product_id);
      this.modalV2Store.open(
        <Suspense
          fallback={<Typography variant="h1">Loading Product...</Typography>}
        >
          <ProductModalV2 />
        </Suspense>,
        'right',
        'md',
      );
    }
  };

  render() {
    const { searchAheadLoading, searchAhead } = this.state;

    return (
      <div className="search-wrapper flex-fill">
        <div className="input-group search-product">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <SearchIcon />
            </div>
          </div>
          <AsyncTypeahead
            id="product-search"
            filterBy={['product_name']}
            allowNew={false}
            isLoading={searchAheadLoading}
            multiple={false}
            options={searchAhead}
            onMenuShow={() => this.uiStore.showBackdrop(70)}
            onMenuHide={() => this.uiStore.hideBackdrop(70)}
            labelKey="product_name"
            minLength={3}
            onSearch={this.handleSearch}
            onKeyDown={this.handleSearchSubmit}
            onChange={this.handleSelected}
            ref={(ref) => (this._typeahead = ref)}
            placeholder="Search for anything..."
            emptyLabel="No matches found"
          />
        </div>
      </div>
    );
  }
}

export default connect('store')(SearchBar);
