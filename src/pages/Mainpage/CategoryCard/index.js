import React from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const CategoryCard = ({ category }) => {
  return (
    <div className="col-6 col-sm-12 col-md-6 col-lg-4">
      <Link
        to={`main/${category.cat_id}`}
        className="category-card-link"
      >
        <div className="category-card">
          <div className="category-card-img-block">
            <LazyLoadImage
              className="category-card-img"
              alt={category.cat_name}
              height="100%"
              src={category.image_ref}
              width="100%"
            />
          </div>
          <div className="category-card-name">
            {category.cat_name}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CategoryCard