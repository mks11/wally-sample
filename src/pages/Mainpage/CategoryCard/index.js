import React from 'react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  return (
    <div className="col-6 col-sm-12 col-md-6 col-lg-4">
      <Link
        to={`main/${category.cat_id}`}
        className="category-card-link"
      >
        <div className="category-card">
          <div
            className="category-card-img"
            style={{ 
              backgroundImage: `url(${category.image_ref || ''})`
            }}
          />
          <div className="category-card-name">
            {category.cat_name}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CategoryCard