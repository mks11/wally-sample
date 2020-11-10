import React, { Component } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'utils';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.uiStore = props.store.ui;
    this.userStore = props.store.user;
    this.productStore = props.store.product;

    this.state = {
      searchAhead: [],
      searchAheadLoading: false,
    };
  }

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
      const { onSearch } = this.props;
      const instance = this._typeahead.getInstance();
      instance.blur();
      onSearch && onSearch(e.target.value);
    }
  };

  handleSelected = (e) => {
    if (e && e.length) {
      const { onSearch } = this.props;
      const instance = this._typeahead.getInstance();
      instance.blur();
      onSearch && onSearch(e[0].name);
    }
  };

  render() {
    const { searchAheadLoading, searchAhead } = this.state;

    return (
      <div className="search-wrapper flex-fill">
        <div className="input-group search-product">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <SearchIcon fontSize="large" />
            </div>
          </div>
          <AsyncTypeahead
            filterBy={['name']}
            allowNew={false}
            isLoading={searchAheadLoading}
            multiple={false}
            options={searchAhead}
            onMenuShow={() => this.uiStore.showBackdrop(70)}
            onMenuHide={() => this.uiStore.hideBackdrop(70)}
            labelKey="name"
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
