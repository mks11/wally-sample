import React from "react"

function ProductRatingStars({ rating }) {
  const makeEmptyStar = key => <div className="empty star" key={key}>&#9734;</div>

  const makeFullStar = key => <div className="full star" key={key}>&#9733;</div>

  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map(star => (
        Math.round(rating) >= star
          ? makeFullStar(star)
          : makeEmptyStar(star)
	  ))}
    </div>
  )
}

export default ProductRatingStars;
