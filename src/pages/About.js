import React, { useEffect } from 'react';
import { logPageView } from 'services/google-analytics';
import { observer } from 'mobx-react';

import about450 from 'images/about-450.jpg';
import about600 from 'images/about-600.jpg';

import { Box, Typography, Grid } from '@material-ui/core';
import HowToPhoto from './shared/HowToPhoto';
import PageSection from 'common/PageSection';
import { useStores } from 'hooks/mobx';
import Page from './shared/Page';

function About() {
  const { routing: routingStore } = useStores();

  useEffect(() => {
    const { location } = routingStore;
    logPageView(location.pathname);
  }, [routingStore]);

  return (
    <Page
      title="About"
      description="Learn more about The Wally Shop's history and vision for a zero-waste future."
    >
      <PageSection>
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={6} lg={4}>
            <AboutPhoto />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Typography variant="h2" gutterBottom>
              We deliver your favorites from the brands you love, 100%
              waste-free.
            </Typography>
            <Typography gutterBottom>
              We're introducing a whole new way to shop sustainably. Our vision
              is to help you shop for everything (bulk foods! Beauty products!
              Household products!) in all reusable packaging conveniently and
              without sacrificing any value. We’re starting with
              responsibly-made, Trader Joe’s price-competitive bulk foods, but
              we will be expanding categories and on-boarding more brands in the
              coming weeks. We want to get you what you need, 100% waste free,
              so please reach out if you have any products in mind ;)
            </Typography>
          </Grid>
        </Grid>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Our Mission
        </Typography>
        <Typography gutterBottom>
          You’ve seen the news, we’ve seen the news. We have a climate- and
          waste- crisis that threatens all of us. However, we definitely don’t
          believe in doom and gloom! We believe that united, we control our
          future. We believe people want to do good, given the choice and it’s
          on us help make it more convenient.
        </Typography>
        <Typography gutterBottom>
          That’s where we come in. Our mission is to help you get what you need
          from your favorite brands, in all reusable, returnable packaging for a
          100% waste free shopping experience. And while we are all cleaning up
          the world ~ we’re going to have fun while we are at it, in full purple
          dreamy glow{' '}
          <span role="img" aria-label="sparkle">
            ✨
          </span>
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Our History
        </Typography>
        <Typography gutterBottom>
          The Wally Shop’s story starts with our founder, Tamara. Due to fate,
          destiny, luck, whatever you want to call it, she experienced
          first-hand two major trends of our generation: the rise of Amazon and
          the plastic-waste crisis.
        </Typography>
        <Typography gutterBottom>
          While working at Amazon, managing the packaging and shipping category,
          she wanted to switch to a more sustainable lifestyle. All the doom and
          gloom surrounding our environment made her anxious about the future,
          especially when thinking about the impact a single person could
          possibly have. But she saw she wasn’t alone ~ there were hundreds of
          thousands of us attending rallies, voicing our concerns and showing
          our support for the planet. She realized that if we could build an
          option that took the best of what something like Amazon could offer -
          value, selection, convenience - but in an inherently sustainably way,
          it would be something for people to rally around and feel powerful.
          Because everytime we choose the reusable option over the disposable
          option, we have made a real, positive impact. Together we can change
          the world, one order at a time.
        </Typography>
      </PageSection>
      <Box>
        <Typography variant="h2" component="p">
          <a href="/">Start shopping sustainably</a>.
        </Typography>
      </Box>
    </Page>
  );
}

export default observer(About);

function AboutPhoto() {
  return (
    <img
      srcSet={`${about450} 450w,
               ${about600} 600w`}
      sizes="(max-width: 767px) 450px,
              600px"
      src={about600}
      alt={'About page'}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
}
