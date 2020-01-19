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
      successMessage: null,
		}

    this.productStore = props.store.product
    this.userStore = props.store.user
  }

  onStarClick = rating => {
    this.setState({ rating, errorMessage: null, successMessage: null })
  }

  onInputChange = event => {
    this.setState({ comment: event.target.value, errorMessage: null, successMessage: null })
  }

	onRateProductClick = async() => {
		const { rating, comment } = this.state
		if (!rating) {
			const errorMessage = 'Please select a star rating'
			this.setState({ errorMessage })
		} else {
			try {
        const res = await this.productStore.rateProduct(this.props.product_id, rating, comment)
        this.productStore.updateRatingComments(res.product_rating, res.comments)
        this.clearFormSuccess()
			} catch(err) {
				this.setState({ errorMessage: 'Oops, there was a problem saving your rating. Please try again later.'})
			}
		}
  }

	makeEmptyStar = star => (
		<div
			className="clickable star"
			key={star.toString() + "-star"}
			onClick={() => this.onStarClick(star)}
		>
			&#9734;
		</div>
	)

  makeFullStar = star => (
		<div
			className="clickable star"
			key={star + "-star"}
			onClick={() => this.onStarClick(star)}
		>
			&#9733;
		</div>
  )
  
  clearFormSuccess() {
    this.setState({
      rating: null,
      comment: "",
      successMessage: 'Your rating has been saved!',
    })
  }

  render() {
    const { rating, comment, errorMessage, successMessage } = this.state
    const errorClass = errorMessage ? " text-error" : ""
    const successClass = successMessage ? " text-success" : ""
    return (
      <div className="product-rating-form">
        <div className="clickable stars-container">
          {[1, 2, 3, 4, 5].map(thisStar =>
						rating >= thisStar
              ? this.makeFullStar(thisStar)
              : this.makeEmptyStar(thisStar)
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
        <div className={"rating-message" + errorClass}>{errorMessage}</div>
        <div className={"rating-message" + successClass}>{successMessage}</div>
      </div>
    )
  }
}

export default connect("store")(ProductRatingForm)
