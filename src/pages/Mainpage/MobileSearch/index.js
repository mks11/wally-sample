import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'

import Filters from '../ProductTop/Filters'

const MobileSearch = props => {
  const {
    show,
    sidebar,
    id,
    onClose,
    onSearch,
    onCategoryClick,
    onFilterUpdate,
  } = props

  return (
    <div className={`category-mobile d-md-none ${show ? 'open' : ''}`}>
      <Row>
        <Col xs={2}>
          <button
            className="btn-close-cart btn-transparent"
            type="button"
            onClick={onClose}
          >
            <span className="navbar-toggler-icon close-icon"></span>
          </button>
        </Col>
        <Col xs={10}>
          <div className="input-group search-product" style={{width: '90%', marginTop: 15}}>
            <div className="input-group-prepend">
              <div className="input-group-text" style={{backgroundColor: '#ececec'}}>
                <i className="fa fa-search"></i>
              </div>
            </div>
            <input
              className="rbt-input-main form-control rbt-input"
              style={{ backgroundColor: '#ececec' }}
              onKeyDown={onSearch}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="px-3">
            <Filters
              onSelect={onFilterUpdate}
              vertical
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul className="category-mobile-wrap">
            {
              sidebar.map((s,i) => {
                const parentSidebarClass = id === s.cat_id ? 'text-violet' : ''
                const link = `/main/${s.cat_id}`

                return (
                  <li key={i}>
                    <div>
                      <Link
                        to={link}
                        className={parentSidebarClass}
                        onClick={onCategoryClick}
                        replace
                      >{s.cat_name}</Link>
                    </div>
                    <ul>
                      {s.sub_cats && s.sub_cats.map((sc, idx) => (
                        <li key={idx}>
                        <Link
                          to={`/main/${sc.cat_id || ''}`}
                          className={id === sc.cat_id ? "text-violet": ""}
                          onClick={onCategoryClick}
                        >{sc.cat_name}</Link></li>
                      ) )}
                    </ul>
                  </li>
                )
              })
            }
          </ul>
        </Col>
      </Row>
    </div>
  )
}

export default MobileSearch
