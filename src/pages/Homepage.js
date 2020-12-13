import React, { useEffect } from 'react';
import { logPageView, logModalView } from 'services/google-analytics';
import qs from 'qs';
import { observer } from 'mobx-react';

import SignupForm from 'forms/authentication/SignupForm';

import intro450 from 'images/intro-450.jpg';
import intro600 from 'images/intro-600.jpg';

import order450 from 'images/order-450.jpg';
import order600 from 'images/order-600.jpg';

import tote450 from 'images/tote-450.jpg';
import tote600 from 'images/tote-600.jpg';

import returnPackaging450 from 'images/return-packaging-450.jpg';
import returnPackaging600 from 'images/return-packaging-600.jpg';
import { useStores } from 'hooks/mobx';

import { Box, Container, Grid, Typography } from '@material-ui/core';
import { PrimaryWallyButton } from '../styled-component-lib/Buttons';

import styled from 'styled-components';
import HowTo from './shared/HowTo';
import Page from './shared/Page';
import PageSection from 'common/PageSection';
import ResponsivePhoto from 'common/ResponsivePhoto';

function Homepage() {
  const {
    user: userStore,
    modalV2: modalV2Store,
    routing: routingStore,
    metric: metricStore,
  } = useStores();

  useEffect(() => {
    const { location } = routingStore;

    logPageView(location.pathname);

    // Not sure if this does anything useful anymore.
    if (qs.parse(location.search, { ignoreQueryPrefix: true }).color) {
      if (
        qs.parse(location.search, { ignoreQueryPrefix: true }).color ===
        'purple'
      ) {
        metricStore.triggerAudienceSource('ig');
      }
    }

    redirectToShopIfLoggedIn();
  }, [userStore.user, metricStore, routingStore]);

  async function redirectToShopIfLoggedIn() {
    if (userStore.user) {
      const { user } = userStore;
      if (user.type === 'admin') {
        routingStore.push('/manage/retail');
      } else {
        routingStore.push('/main');
      }
    } else {
      try {
        await userStore.getStatus();
      } catch (error) {
        // TODO: Implement a more elegant error handler than this.
        console.error("Couldn't check user's auth status.");
      }
    }
  }

  const handleSignup = (e) => {
    logModalView('/signup-zip');
    modalV2Store.open(<SignupForm />);
  };

  const StartShoppingButton = () => (
    <Box my={5}>
      <PrimaryWallyButton onClick={handleSignup}>
        Start Shopping
      </PrimaryWallyButton>
    </Box>
  );

  return (
    <Page
      style={{
        backgroundImage: 'linear-gradient(#fae1ff, #fff)',
      }}
    >
      <NowShippingNationWideBanner />
      <PageSection>
        <Grid display="flex" flex={1} alignItems="center" container>
          <Grid item xs={12} sm={6} align="center">
            <Container maxWidth="sm">
              <IntroPhoto />
            </Container>
          </Grid>
          <Grid item sm={6}>
            <Container maxWidth="sm">
              <Box my={5}>
                <Typography variant="h1" gutterBottom>
                  Do you, with reusables.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  The Wally Shop connects you with your favorite brands 100%
                  waste-free. Our vision is to help you shop for everything in
                  all reusable packaging. We're now available nationwide!
                </Typography>
                <StartShoppingButton />
              </Box>
            </Container>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection>
        <HowTo
          title="Order"
          description="Choose from hundreds of responsibly-made, price-competitive bulk foods. At checkout, you'll be charged a
              deposit for your packaging."
          photo={
            <ResponsivePhoto
              mobileSrc={order450}
              desktopSrc={order600}
              alt="Man giving money in exchange for a jar of pasta."
            />
          }
          photoAlign="right"
        />
      </PageSection>
      <PageSection>
        <HowTo
          title="Receive"
          description="Your order will arrive at your door in completely reusable,
              returnable packaging. The shipping tote it arrives in folds up for
              easy storage. Simple, convenient, 100% waste free shopping."
          photo={
            <ResponsivePhoto
              mobileSrc={tote450}
              desktopSrc={tote600}
              alt="The Wally Shop's reusable tote."
            />
          }
          photoAlign="left"
        />
      </PageSection>
      <PageSection>
        <HowTo
          title="Return"
          description="Once finished, you'll schedule a free packaging pick up or leave your packaging with your courier during a future delivery. Once received at our warehouse, your deposit is credited back to you and the packaging is cleaned to be put back into circulation."
          photo={
            <ResponsivePhoto
              mobileSrc={returnPackaging450}
              desktopSrc={returnPackaging600}
              alt="Returning an empty jar."
            />
          }
          photoAlign="right"
        />
      </PageSection>
      <PageSection>
        <Box px={2} my={5}>
          <Typography variant="h2" gutterBottom>
            Experience The Wally Shop
          </Typography>
          <Typography gutterBottom>
            Thousands of shoppers are joining the reusables revolution. Now,
            it's your turn.
          </Typography>
          <StartShoppingButton />
        </Box>
      </PageSection>
    </Page>
  );
}

export default observer(Homepage);

const ScrollingContainer = styled('div')`
  display: inline-block;
  animation: marquee 20s linear infinite;
`;

const ScrollingContainer2 = styled('div')`
  display: inline-block;
  animation: marquee2 20s linear infinite;

  /* Must be half the animation duration of both divs so it stats in sync to
  fill void left by completed transtition of first div */
  animation-delay: 10s;
`;

const ScrollingH1 = styled('h1')`
  text-align: center;
  font-family: 'NEONGLOW';
  color: #3c2ebf;
`;

function NowShippingNationWideBanner() {
  return (
    <Box overflow="hidden" whiteSpace="nowrap">
      <ScrollingContainer>
        <ScrollingH1>
          Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
          nationwide ~{' '}
        </ScrollingH1>
      </ScrollingContainer>
      <ScrollingContainer2>
        <ScrollingH1>
          Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
          nationwide ~{' '}
        </ScrollingH1>
      </ScrollingContainer2>
    </Box>
  );
}

function IntroPhoto() {
  return (
    <ResponsivePhoto
      mobileSrc={intro450}
      desktopSrc={intro600}
      alt="Man holding jar of green lentils."
    />
  );
}
