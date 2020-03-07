import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from '../../../utils'
import { Button } from 'reactstrap'
import Product from '../Product'

class CategoriesList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCategory: null
    }
  }

  handleCategoryExpand = id => {
    this.setState({
      selectedCategory: this.state.selectedCategory === id ? null : id
    })
  }

  handleAllClick = () => {
    this.props.store.routing.push('/main')
  }

  render() {
    const {
      selectedId,
      list,
    } = this.props
    const { selectedCategory } = this.state

    return (
      <div className="categories-list">
        <div>
          <h4 className={`categories-list-group`} onClick={this.handleAllClick}>All</h4>
        </div>
        {
          list.map(s => {
            return (
              <div className="mb-0" key={s.category_id}>
                <h4
                  className={`categories-list-group ${selectedCategory === s.category_id ? 'selected-group' : ''}`}
                  onClick={() => this.handleCategoryExpand(s.category_id)}
                >
                  {s.name}
                </h4>
                <ul>
                  {s.categories && s.categories.map((sc, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/main/${sc.category_id || ''}`}
                        className={selectedId === sc.category_id ? "text-violet": ""}
                      >{sc.name}</Link>
                    </li>
                  ) )}
                </ul>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default connect("store")(CategoriesList)
