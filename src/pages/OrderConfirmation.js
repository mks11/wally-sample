import React, { Component } from 'react';

import { logPageView, logModalView } from 'services/google-analytics';
import { connect } from '../utils';

// Custom Components
import PageSection from 'common/PageSection';

// Material UI
import { Box, Container, Typography } from '@material-ui/core';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
class OrderConfirmation extends Component {
  constructor(props) {
    super(props);

    this.routing = this.props.store.routing;
    this.userStore = this.props.store.user;
    this.modalStore = this.props.store.modal;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);

    logModalView('/refer');

    this.userStore.getStatus(true).then((status) => {
      if (status) {
        this.modalStore.toggleModal('referral');
      } else {
        this.routing.push('/main');
      }
    });
  }

  handleShopMore() {
    this.routing.push('/main');
  }

  render() {
    const id = this.props.match.params.id;
    if (!id) {
      return null;
    }

    return (
      <PageSection>
        <Container maxWidth="xl">
          <Typography variant="h1" gutterBottom>
            Your order has been placed!
          </Typography>
          <Typography variant="h2" gutterBottom>
            Order ID: #{id}
          </Typography>
          <Typography gutterBottom>Thank you for your order!</Typography>
          <Typography gutterBottom>
            You should receive an order confirmation email shortly.
          </Typography>
          <Typography gutterBottom>
            When you’re finished with your packaging, flip the shipping label on
            your tote to the reverse side. This is where your return label is
            located. You can either drop off your packaging with a delivery
            courier on your next order, or schedule a pickup through our website
            when you're ready to return your packaging.
          </Typography>
          <Box my={4}>
            <PrimaryWallyButton onClick={(e) => this.handleShopMore(e)}>
              Keep Shopping
            </PrimaryWallyButton>
          </Box>
        </Container>
      </PageSection>
    );
  }
}

export default connect('store')(OrderConfirmation);
