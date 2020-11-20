import React, { Component } from 'react';
import { Box, Typography } from '@material-ui/core';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Label } from 'styled-component-lib/InputLabel';
import { Input } from 'reactstrap';

import { connect } from '../utils';

class ProductRatingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: null,
      comment: '',
      errorMessage: null,
      successMessage: null,
    };

    this.productStore = props.store.product;
    this.userStore = props.store.user;
  }

  onStarClick = (rating) => {
    this.setState({ rating, errorMessage: null, successMessage: null });
  };

  onInputChange = (event) => {
    this.setState({
      comment: event.target.value,
      errorMessage: null,
      successMessage: null,
    });
  };

  onRateProductClick = async () => {
    const { rating, comment } = this.state;
    if (!rating) {
      const errorMessage = 'Please select a star rating';
      this.setState({ errorMessage });
    } else {
      try {
        const res = await this.productStore.rateProduct(
          this.props.product_id,
          rating,
          comment,
        );
        this.productStore.updateRatingComments(
          res.product_rating,
          res.comments,
        );
        this.clearFormSuccess();
      } catch (err) {
        this.setState({
          errorMessage:
            'Oops, there was a problem saving your rating. Please make sure to login and try again later.',
        });
      }
    }
  };

  makeEmptyStar = (star) => (
    <div
      className="clickable star"
      key={star.toString() + '-star'}
      onClick={() => this.onStarClick(star)}
    >
      &#9734;
    </div>
  );

  makeFullStar = (star) => (
    <div
      className="clickable star"
      key={star + '-star'}
      onClick={() => this.onStarClick(star)}
    >
      &#9733;
    </div>
  );

  clearFormSuccess() {
    this.setState({
      rating: null,
      comment: '',
      successMessage: 'Your rating has been saved!',
    });
  }

  render() {
    const { rating, comment, errorMessage, successMessage } = this.state;
    const errorClass = errorMessage ? ' text-error' : '';
    const successClass = successMessage ? ' text-success' : '';
    return (
      <Box padding={1}>
        <Typography variant="h2" gutterBottom>
          Leave a rating
        </Typography>
        <Label>Stars</Label>
        <div className="clickable stars-container">
          {[1, 2, 3, 4, 5].map((thisStar) =>
            rating >= thisStar
              ? this.makeFullStar(thisStar)
              : this.makeEmptyStar(thisStar),
          )}
        </div>
        <br />
        <Input
          className="product-comment-input"
          type="textarea"
          value={comment}
          onChange={this.onInputChange}
          maxLength="300"
          placeholder="Any additional feedback?"
        />
        <br />
        <PrimaryWallyButton
          onClick={this.onRateProductClick}
          style={{ padding: '.5rem', width: '250px' }}
        >
          <Typography variant="body1">Rate Product</Typography>
        </PrimaryWallyButton>
        <div className={'rating-message' + errorClass}>{errorMessage}</div>
        <div className={'rating-message' + successClass}>{successMessage}</div>
      </Box>
    );
  }
}

export default connect('store')(ProductRatingForm);
