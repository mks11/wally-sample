import React, { Component } from "react"
import { Input, Button } from "reactstrap"

import { connect } from '../utils'

class ProductRatingForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rating: null,
      comment: "",
			errorMessage: null,
		}

		this.productStore = this.props.store.product
  }

  onStarClick = rating => {
    this.setState({ rating, errorMessage: null })
  }

  onInputChange = event => {
    this.setState({ comment: event.target.value })
  }

  onRateProductClick = () => {
		const { rating, comment } = this.state

		if (!rating) {
			const errorMessage = 'Please select a rating'
			this.setState({ errorMessage: errorMessage })
		} else {
			this.productStore.rateProduct(this.props.id, rating, comment)
		}
  }

  emptyStar = rating => (
		<div
			className="clickable star"
			key={rating.toString() + "-star"}
			onClick={() => this.onStarClick(rating)}
		>
			&#9734;
		</div>
	)

  solidStar = rating => (
		<div
			className="clickable star"
			key={rating + "-star"}
			onClick={() => this.onStarClick(rating)}
		>
			&#9733;
		</div>
	)

  render() {
		const { rating, comment, errorMessage } = this.state
		const errorClass = errorMessage ? " text-error" : ""
    return (
      <div className="product-rating-form">
        <div className="clickable stars-container">
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
					maxLength="300"
          placeholder="Add comment here (optional) ..."
        />
        <Button className="rate-btn" onClick={this.onRateProductClick}>
          Rate Product
        </Button>
        <div className={"rating-error" + errorClass}>{errorMessage}</div>
      </div>
    )
  }
}

export default connect("store")(ProductRatingForm)
