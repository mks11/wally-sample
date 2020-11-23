import React, { useState, useEffect } from 'react';
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
import HowToPhoto from './shared/HowToPhoto';
import Page from './shared/Page';
import PageSection from 'common/PageSection';

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

    if (userStore.user) {
      const { user } = userStore;
      if (user.type === 'admin') {
        routingStore.push('/manage/retail');
      } else {
        routingStore.push('/main');
      }
    }
  }, [userStore.user, metricStore, routingStore]);

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
                  Shop package-free groceries
                </Typography>
                <Typography variant="body1" component="h4" gutterBottom>
                  In response to Covid-19, The Wally Shop has no more waitlist,
                  making access to food available to all.\n For every order
                  placed, we'll also be donating $1 to Feeding America.
                </Typography>
                <StartShoppingButton />
              </Box>
            </Container>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection>
        <Box px={2}>
          <Typography variant="h2" gutterBottom>
            Do you, with reusables.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The Wally Shop is the platform connecting you with your favorite
            brands 100% waste-free IRL and we are now available nationwide. Our
            vision is to help you shop for everything in all reusable packaging
            (cleaning, beauty, pet supplies, you name it!). We hope you’re as
            ready as we are to join the #reusablesrevolution and change the
            world in dreamy purple ~ one order at a time. #wallydreamsinpurple
          </Typography>
        </Box>
      </PageSection>

      <PageSection>
        <HowTo
          title="Order"
          description="Choose from hundreds of responsibly-made, Trader Joe’s
              price-competitive bulk foods. At checkout, you will be charged a
              deposit for your packaging (don’t worry, you will be getting it
              back!)."
          photo={
            <HowToPhoto
              src450={order450}
              src600={order600}
              alt="Man giving money in exchange for a jar of pasta."
            />
          }
          photoAlign="right"
        />
      </PageSection>
      <PageSection>
        <HowTo
          title="Receive"
          description="Your order will arrive at your doorHowTo in completely reusable,
              returnable packaging. The shipping tote it arrives in folds up for
              easy storage. Simple, convenient, 100% waste free shopping."
          photo={
            <HowToPhoto
              src450={tote450}
              src600={tote600}
              alt="The Wally Shop's reusable tote."
            />
          }
          photoAlign="left"
        />
      </PageSection>
      <PageSection>
        <HowTo
          title="Return"
          description="Once finished, you can return all your packaging (jars, totes,
              anything we send to you, we take back and reuse) to a FedEx/UPS
              delivery courier on a future delivery or schedule a free pick-up
              on the website. Your deposit is credited back to you and the
              packaging is cleaned to be put back into circulation."
          photo={
            <HowToPhoto
              src450={returnPackaging450}
              src600={returnPackaging600}
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
    <HowToPhoto
      src450={intro450}
      src600={intro600}
      alt="Man holding jar of green lentils."
    />
  );
}
