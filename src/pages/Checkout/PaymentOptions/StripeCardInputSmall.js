import React from 'react';
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import Checkbox from 'common/FormikComponents/NonRenderPropAPI/Checkbox';
import { Typography } from '@material-ui/core';

// TODO style the input
const createOptions = (padding) => {
  return {
    style: {
      base: {
        border: '1px solid #000',
        fontSize: '14px',
        color: '#000',
        fontFamily: 'Circe',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? { padding } : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class SplitForm extends React.Component {
  state = {
    invalidText: '',
  };

  handleSubmit = async (ev) => {
    this.setState({
      invalidText: '',
    });

    ev.preventDefault();

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    this.props.stripe
      .createToken(cardElement)
      .then((payload) => {
        if (payload.error) {
          throw payload;
        }
        return this.props.onAdd({
          preferred_payment: this.state.preferred_payment,
          billing_zip: this.state.billing_zip,
          stripeToken: payload.token.id,
        });
      })
      .catch((e) => {
        if (e.response) {
          const msg = e.response.data.error.message;
          this.setState({ invalidText: msg });
          return;
        }
        if (e.error) {
          this.setState({ invalidText: e.error.message });
        }
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement />
        <Checkbox
          label="Make default payment card"
          name="isPreferredAddress" //todo confirm the name
          color="primary"
        />
        <PrimaryWallyButton variant="outlined" type="submit">
          Add New Card
        </PrimaryWallyButton>
        {this.state.invalidText ? (
          <Typography color="error">{this.state.invalidText}</Typography>
        ) : null}
      </form>
    );
  }
}

const _SplitForm = (props) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <SplitForm elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

export default _SplitForm;
