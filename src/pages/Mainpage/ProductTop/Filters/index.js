import React, { Component } from 'react'
import { connect } from 'utils'

const FILTERS_DATA = [
  { title: 'Dairy Free', value: 'dairy' },
  { title: 'Gluten Free', value: 'gluten' },
  { title: 'Peanut Free', value: 'peanuts' },
  { title: 'Tree Nuts Free', value: 'tree nuts' },
  { title: 'Organic', value: 'organic' },
  { title: 'Non GMO', value: 'non gmo' },
  { title: 'Fair Trade', value: 'fair trade' },
  { title: 'Kosher', value: 'kosher' },
]

class Filters extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filters: []
    }
  }

  handleOnFilterSelect = value => {
    const { filters } = this.state

    const valueIndex = filters.indexOf(value)

    if (valueIndex === -1) {
      filters.push(value)
    } else {
      filters.splice(valueIndex, 1)
    }

    this.setState({ filters })
    this.props.onSelect && this.props.onSelect(filters)
  }

  render() {
    const { filters } = this.state
    const { vertical = false } = this.props

    return (
      <div className={`filters ${vertical ? 'vertical' : ''}`}>
        <div className="filters-title">Filter by diet:</div>
        <div className="filters-values">
          <ul>
            {
              FILTERS_DATA.map(f => (
                <li
                  key={f.value}
                  className={`${filters.includes(f.value) ? 'filters-selected' : ''}`}
                  onClick={() => this.handleOnFilterSelect(f.value)}
                >{f.title}</li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default connect('store')(Filters)
