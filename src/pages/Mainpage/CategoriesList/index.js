import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from '../../../utils';

// Material UI
import { Typography } from '@material-ui/core';

class CategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: null,
    };
  }

  handleAllClick = () => {
    this.props.store.routing.push('/main');
  };

  render() {
    const { selectedId, list } = this.props;
    const { selectedCategory } = this.state;

    return (
      <div className="categories-list">
        <Typography component="p" gutterBottom variant="h5">
          Shop by category:
        </Typography>
        <div>
          <h4 className={`categories-list-group`} onClick={this.handleAllClick}>
            All
          </h4>
        </div>
        {list.map((s) => {
          const link = `/main/${s.category_id}`;
          return (
            <div className="mb-0" key={s.category_id}>
              <Link
                className={`categories-list-group ${
                  selectedCategory === s.category_id ? 'selected-group' : ''
                }`}
                to={link}
                style={{ display: 'block', fontWeight: 'bold' }}
              >
                {s.name}
              </Link>
              <ul>
                {s.categories &&
                  [...s.categories]
                    .sort((a, b) => {
                      if (a.name > b.name) return 1;
                      else if (a.name < b.name) return -1;
                      else return 0;
                    })
                    .map((sc, idx) => (
                      <li key={idx}>
                        <Link
                          to={`/main/${sc.category_id || ''}`}
                          className={
                            selectedId === sc.category_id ? 'text-violet' : ''
                          }
                        >
                          {sc.name}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect('store')(CategoriesList);
