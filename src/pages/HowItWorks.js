import React from 'react';

// Custom Components
import Page from 'templates/Page';
import PageSection from 'common/PageSection';

// Images
import orderHd600 from 'images/order-hd-600.jpg';
import toteHd600 from 'images/tote-hd-600.jpg';
import returnPackagingHd600 from 'images/return-packaging-hd-600.jpg';

// Material UI
import { Box, Grid, Typography } from '@material-ui/core';

// Styled Components
import { ReverseOrderPhotoWrapper } from 'styled-component-lib/Grid';

export default function HowItWorks() {
  return (
    <Page
      title="How it Works"
      description="Learn about The Wally Shop service."
      content="Our Process"
    >
      <PageSection>
        <Box py={4} px={2}>
          <Typography variant="h1" gutterBottom>
            It's what's on the inside that counts.
          </Typography>
          <Typography>
            We're introducing a whole new way to shop sustainably. Our vision is
            to help you shop for everything (Bulk foods! Beauty products!
            Household products!) conveniently in all reusable packaging. We’re
            starting with responsibly-made, Trader Joe’s price-competitive bulk
            foods, but we will be expanding categories and on-boarding more
            brands constantly. We want to get you what you need, 100% waste
            free, so please{' '}
            <a href="mailto: info@thewallyshop.co" alt="reach out to us.">
              reach out
            </a>{' '}
            if you have any brands in mind.
          </Typography>
        </Box>
      </PageSection>
      <PageSection>
        <Grid alignItems="center" container justify="center" spacing={4}>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h2" gutterBottom>
                Order
              </Typography>
              <Typography variant="body1" gutterBottom>
                Choose from hundreds of responsibly-made, Trader Joe’s
                price-competitive bulk foods. At checkout, you will be charged a
                deposit for your packaging (don’t worry, you will be getting it
                back!).
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
                src={orderHd600}
                alt={'Man giving money in exchange for a jar of pasta.'}
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
        <Grid alignItems="center" container justify="center" spacing={4}>
          <ReverseOrderPhotoWrapper item xs={12} sm={5} md={6} order={4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              px={2}
            >
              <img
                src={toteHd600}
                alt={"The Wally Shop's reusable tote."}
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
                Receive
              </Typography>
              <Typography variant="body1" gutterBottom>
                Your order will arrive at your doorstep in completely reusable,
                returnable packaging. The shipping tote it arrives in folds up
                for easy storage. Simple, convenient, 100% waste free shopping.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </PageSection>
      <PageSection>
        <Grid alignItems="center" container justify="center" spacing={4}>
          <Grid item xs={12} sm={7} md={6}>
            <Box px={2}>
              <Typography variant="h2" gutterBottom>
                Return
              </Typography>
              <Typography variant="body1" gutterBottom>
                Once finished, you can return all your packaging (jars, totes,
                anything we send to you, we take back and reuse) to a UPS
                delivery courier on a future delivery or schedule a free pick-up
                on the website. Your deposit is credited back to you and the
                packaging is cleaned to be put back into circulation.
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
                src={returnPackagingHd600}
                alt={'Returning an empty jar.'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </PageSection>
    </Page>
  );
}
