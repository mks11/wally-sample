import React, { Component } from "react"
import { Input, Button } from "reactstrap"

class ProductRatingForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rating: null,
      comment: "",
      error: null,
    }
  }

  onStarClick = rating => {
    this.setState({ rating, error: false })
  }

  onInputChange = event => {
    this.setState({ comment: event.target.value })
  }

  onRateProductClick = () => {
    if (!this.state.rating) {
      this.setState({ error: true })
    }
  }

  emptyStar = rating => (
		<div
			className="clickable-star"
			key={rating.toString() + "-star"}
			onClick={() => this.onStarClick(rating)}
		>
			&#9734;
		</div>
	)

  solidStar = rating => (
		<div
			className="clickable-star"
			key={rating + "-star"}
			onClick={() => this.onStarClick(rating)}
		>
			&#9733;
		</div>
	)

  render() {
		const { rating, comment, error } = this.state
		const errorClass = error ? " error" : ""
    return (
      <div className="product-rating-form">
        <div className="clickable-stars-container">
          {[1, 2, 3, 4, 5].map(thisStar =>
						rating >= thisStar
              ? this.solidStar(thisStar)
              : this.emptyStar(thisStar)
          )}
        </div>
        <Input
          className="product-comment-input"
          type="textarea"
          value={comment}
          onChange={this.onInputChange}
          placeholder="Add comment here (optional) ..."
        />
        <Button className="rate-btn" onClick={this.onRateProductClick}>
          Rate Product
        </Button>
        <div className={"rating-error" + errorClass}>Please select a rating</div>
      </div>
    )
  }
}

export default ProductRatingForm
