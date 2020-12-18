import React, { Component } from 'react';
import { connect } from 'utils';

const FILTERS_DATA = [
  { title: 'Dairy Free', value: 'allergen,dairy' },
  { title: 'Gluten Free', value: 'allergen,gluten' },
  { title: 'Peanut Free', value: 'allergen,peanuts' },
  { title: 'Tree Nuts Free', value: 'allergen,tree nuts' },
  { title: 'Made With Organic', value: 'tag,organic' },
  { title: 'Non GMO', value: 'tag,non gmo' },
  { title: 'Fair Trade', value: 'tag,fair trade' },
  // { title: 'Fair Trade', value: 'tag,fair trade' },
  // { title: 'Kosher', value: 'tag,kosher' },
];

class Filters extends Component {
  constructor(props) {
    super(props);
    this.productStore = this.props.store.product;
  }

  handleOnFilterSelect = (value) => {
    const { filters } = this.productStore;

    const valueIndex = filters.indexOf(value);

    if (valueIndex === -1) {
      this.productStore.addFilter(value);
    } else {
      this.productStore.removeFilter(valueIndex);
    }

    this.props.onSelect && this.props.onSelect(filters);
  };

  render() {
    const { filters } = this.productStore;
    const { vertical = false, column = false } = this.props;

    return (
      <div
        className={`filters ${vertical ? 'vertical' : ''} ${
          column ? 'column' : ''
        }`}
      >
        <div className="filters-title">Filter by diet:</div>
        <div className="filters-values">
          <ul>
            {FILTERS_DATA.map((f) => (
              <li
                key={f.value}
                className={`${
                  filters.includes(f.value) ? 'filters-selected' : ''
                }`}
                onClick={() => this.handleOnFilterSelect(f.value)}
              >
                {f.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default connect('store')(Filters);
