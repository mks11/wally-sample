import React, { useEffect } from 'react';
import { logPageView, logModalView } from 'services/google-analytics';
import qs from 'qs';

// Custom Components
import Page from 'templates/Page';
import PageSection from 'common/PageSection';
import SignupForm from 'forms/authentication/SignupForm';

// Images
import intro600 from 'images/intro-600.jpg';
import order600 from 'images/order-600.jpg';
import tote600 from 'images/tote-600.jpg';
import returnPackaging600 from 'images/return-packaging-600.jpg';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Material UI
import { Box, Grid, Typography } from '@material-ui/core';

// Styled Components
import styled from 'styled-components';
import { PrimaryWallyButton } from '../styled-component-lib/Buttons';
import { ReverseOrderPhotoWrapper } from 'styled-component-lib/Grid';

function Homepage() {
  const {
    user: userStore,
    modalV2: modalV2Store,
    routing: routingStore,
    metric: metricStore,
  } = useStores();
  const { isAdmin, isOps, isOpsLead, isRetail, isUser, user } = userStore;

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
  }, []);

  useEffect(() => {
    redirectToShopIfLoggedIn();
  }, [user]);

  async function redirectToShopIfLoggedIn() {
    if (user && isAdmin) {
      routingStore.push('/manage/retail');
    } else if (user && (isOps || isOpsLead)) {
      routingStore.push('/pick-pack');
    } else if (user && isRetail) {
      routingStore.push('/retail');
    } else if (user && isUser) {
      routingStore.push('/main');
    }
  }

  const handleSignup = (e) => {
    logModalView('/signup');
    modalV2Store.open(<SignupForm />);
  };

  const StartShoppingButton = () => (
    <Box mt={5}>
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
      {/* <NowShippingNationWideBanner /> */}
      <PageSection>
        <Grid alignItems="center" container justify="center" spacing={4}>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h1" gutterBottom>
                Do you, with reusables.
              </Typography>
              <Typography variant="body1" gutterBottom>
                The Wally Shop connects you with your favorite brands 100%
                waste-free. Our vision is to help you shop for everything in all
                reusable packaging.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <img
                src={intro600}
                alt={'Man holding jar of green lentils.'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection>
        <Grid container alignItems="center" spacing={4}>
          <ReverseOrderPhotoWrapper item xs={12} sm={5} md={6} order={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <img
                src={order600}
                alt={'Man giving money in exchange for a jar of pasta.'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </ReverseOrderPhotoWrapper>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h2" gutterBottom>
                Order
              </Typography>
              <Typography variant="body1">
                Choose from hundreds of responsibly-made, price-competitive bulk
                foods. At checkout, you'll be charged a deposit for your
                packaging.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </PageSection>
      <PageSection>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h2" gutterBottom>
                Receive
              </Typography>
              <Typography variant="body1">
                Your order will arrive at your door in completely reusable,
                returnable packaging. The shipping tote it arrives in folds up
                for easy storage. Simple, convenient, 100% waste free shopping.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <img
                src={tote600}
                alt={"The Wally Shop's reusable tote."}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </PageSection>
      <PageSection>
        <Grid container alignItems="center" spacing={4}>
          <ReverseOrderPhotoWrapper item xs={12} sm={5} md={6} order={8}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <img
                src={returnPackaging600}
                alt={'Returning an empty jar.'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </ReverseOrderPhotoWrapper>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h2" gutterBottom>
                Return
              </Typography>
              <Typography variant="body1">
                Once finished, you'll schedule a free packaging pick up or leave
                your packaging with your courier during a future delivery. Once
                received at our warehouse, your deposit is credited back to you
                and the packaging is cleaned to be put back into circulation.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </PageSection>
      <PageSection>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} md={6}>
            <Box px={3} py={4}>
              <Typography variant="h2" gutterBottom>
                Experience The Wally Shop
              </Typography>
              <Typography gutterBottom>
                Thousands of shoppers are joining the reusables revolution. Now,
                it's your turn.
              </Typography>
              <StartShoppingButton />
            </Box>
          </Grid>
        </Grid>
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

// function NowShippingNationWideBanner() {
//   return (
//     <Box overflow="hidden" whiteSpace="nowrap">
//       <ScrollingContainer>
//         <ScrollingH1>
//           Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
//           nationwide ~{' '}
//         </ScrollingH1>
//       </ScrollingContainer>
//       <ScrollingContainer2>
//         <ScrollingH1>
//           Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
//           nationwide ~{' '}
//         </ScrollingH1>
//       </ScrollingContainer2>
//     </Box>
//   );
// }
