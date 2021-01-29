import React, { useEffect } from 'react';
import { logPageView } from 'services/google-analytics';

// Custom Components
import Page from 'templates/Page';
import PageSection from 'common/PageSection';

// Images
import about450 from 'images/about-450.jpg';

// Material UI
import { Box, Typography, Grid } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// React Responsive
import { useMediaQuery } from 'react-responsive';

// React Router
import { InternalWallyLink } from 'styled-component-lib/Links';

function About() {
  const { routing: routingStore } = useStores();
  const isXs = useMediaQuery({ query: '(max-width: 603px)' });

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
        <Typography variant="h1" align="center" gutterBottom>
          {isXs ? (
            <>
              <span>We deliver your faves </span>
              <br />
              <span>from brands you love,</span>
              <br />
              <span> 100% waste-free.</span>
            </>
          ) : (
            <>
              <span>We deliver your faves from brands</span>
              <br />
              <span>you love, 100% waste-free.</span>
            </>
          )}
        </Typography>
        <Grid container alignItems="center" justify="center" spacing={4}>
          <Grid item xs={8} sm={6} md={5} lg={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <AboutPhoto />
            </Box>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Typography gutterBottom>
              We're introducing a whole new way to shop sustainably. Our vision
              is to help you shop for everything in all reusable packaging,
              conveniently, and without sacrificing value! Our all-reusable
              packaging can be returned so you can partake in our sustainable,
              closed-loop system. By offering bulk grocery, household cleaning,
              and personal care items without any packaging waste, we’re making
              responsible and sustainable shopping convenient!
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
          future. We believe people want to do good, given the choice, and it’s
          on us to help make it more convenient.
        </Typography>
        <Typography gutterBottom>
          That’s where The Wally Shop comes in. Our mission is to help you get
          what you need from your favorite brands, in all reusable, returnable
          packaging for a 100% waste free shopping experience. And while we are
          all cleaning up the world, we’re going to have fun while we are at it!{' '}
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
          value, selection, convenience - but in an inherently sustainable way,
          it would be something for people to rally around and feel powerful.
          Because everytime we choose the reusable option over the disposable
          option, we have made a real, positive impact. Together we can change
          the world, one order at a time.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Our Values
        </Typography>
        <Typography gutterBottom>
          At our core, we are a zero-waste store that cares deeply about
          sustainability. We know that in order to be sustainable, we need to
          look at the BIG PICTURE, not just the packaging. That is why we strive
          to source the highest quality products possible. Organic, fair trade,
          and non-gmo products are at the core of living a more sustainable
          lifestyle and we believe that these products should be easily
          accessible to all.
        </Typography>
        <Typography gutterBottom>
          We source our products both from large-scale distributors and directly
          through small, mission-driven brands. Although we are a small but
          mighty company, we continue to source more and more sustainable, high
          quality products in bulk thanks to YOUR support! Our community
          continues to grow and helps us spread the #reusablerevolution.
        </Typography>
        <Typography gutterBottom>
          In true Wally fashion, we want to be fully transparent with you.
          Although we are sourcing organic products, our packing facility is not
          certified organic - yet! This means that we cannot claim any product
          we sell is certified organic, and instead use the tag “Made with at
          least 95% organic ingredients.” So while our products aren’t
          “certified organic”, please know that you are still receiving high
          quality products made with the organic ingredients you love!
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h1" gutterBottom>
          How does The Wally Shop Work?
        </Typography>
        <Typography gutterBottom>
          Here at The Wally Shop, we understand that our closed loop delivery
          service is new, exciting, and a little confusing. To sum it up, we are
          an innovative, zero-waste grocery & home goods delivery service that
          brings customers their favorite products in all-reusable packaging.
          The all-reusable packaging can be returned so customers can partake in
          our sustainable, closed-loop system. By offering bulk grocery,
          household cleaning, and personal care items without any packaging
          waste, we’re making responsible and sustainable shopping convenient!
        </Typography>
        <Typography>Now, let’s dive into the nitty gritty details.</Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Sign Up
        </Typography>
        <Typography>
          When you sign up for The Wally Shop, you’ll see we offer a vast
          selection of pantry essentials, household cleaning supplies, and
          personal care items. Each of these products are packed (with love!) at
          our warehouse in Austin, Texas. Although we started in Brooklyn, we
          made the hop, skip, and jump over to Texas when we started shipping
          nationwide so we could better serve our customers across the
          continental US!
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Shopping
        </Typography>
        <Typography gutterBottom>
          When you start to add goodies to your cart, you’ll notice a bar that
          tracks your progress toward minimizing your carbon footprint by
          filling your tote. Each of our totes fit 12 jars, so once you reach 12
          jars, you've fully filled the tote! Yeehaw!
        </Typography>
        <Typography variant="h3" gutterBottom>
          Checkout
        </Typography>
        <Typography gutterBottom>
          When you’re ready to checkout, you’ll see a packaging deposit based on
          the number of jars, bottles, and totes your order fills. Each jar and
          bottle has a packaging deposit of $1 while the tote has a deposit of
          $10. So, if you have 12 jars and 1 tote, you will pay a deposit of
          $22! But don’t worry – you’ll get this back once you return your
          packaging! You will normally see your packaging deposit returned
          within one week of returning your packaging. Please note, this deposit
          is initially returned as store credit to be used on a future order,
          but you can reach out to us at{' '}
          <a
            href="mailto:info@thewallyshop.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            info@thewallyshop.co
          </a>{' '}
          to request a refund to your original payment method, if you like.
        </Typography>
        <Typography variant="h3" gutterBottom>
          Returning your packaging
        </Typography>
        <Typography>
          Speaking of returning the packaging, you’re probably wondering how the
          heck you’re supposed to do that! It’s pretty simple: The return label
          is located on the backside of the original shipping label, so simply
          flip over the cardstock on each of your totes so they're ready to be
          returned! You can either drop off your tote at your local UPS facility
          or schedule a pickup through our website (make sure you're logged in!)
          Then voila, you’ve completed your first closed-loop shopping
          experience with The Wally Shop!
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Our packaging
        </Typography>
        <Typography gutterBottom>
          Let us guess… you have some specific questions regarding our packaging
          and we get that! Let us clear some things up.
        </Typography>
        <Typography variant="h3" gutterBottom>
          The types of packaging we use
        </Typography>
        <Typography gutterBottom>
          We have two types of packaging that we use for our waste free goods.
          Polypropylene jars and HDPE (High Density Polyethylene) bottles.
          Polypropylene and HDPE are heat- and chemical- resistant, tough, and
          flexible plastics that can be used thousands of times! They are BPA-
          free and considered to be the safest of all plastics because of their
          high resistance to heat, making them microwave and dishwasher safe.
          These jars and bottles vary in sizing, from 4oz to 32oz! Our jars are
          cleaned in our warehouse using a commercial dishwasher. Commercial
          dishwashers use extremely high temperatures, making it safe for reuse.
          While we so appreciate you wanting to help out, please leave the
          cleaning to the pros!
        </Typography>
        <Typography variant="h3" gutterBottom>
          How do I know what's in each jar?
        </Typography>
        <Typography>
          You may ask, “If you reuse your jars and they all look the same, how
          do I know which product is which?” We’ve got an answer: Each jar has a
          unique QR code on the bottom. This QR code allows you to see what the
          product is (like a traditional label!) If you hold your camera up to
          it and click the link, it will send you directly to the product page
          on our site. On the backend, the QR label also allows us to see how
          far a jar has traveled and how many times it’s been reused! So please
          make sure to keep it attached, it’s like the jar's birthmark!
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Our packing process
        </Typography>
        <Typography gutterBottom>
          So, we’re a sustainability shop with your favorite brands. You may be
          wondering, how do you receive all of these wonderful products that one
          would normally see in single use packaging on the shelf of your local
          grocery store?
        </Typography>
        <Typography variant="h3" gutterBottom>
          What packaging do your bulk products arrive at the warehouse in & how
          do you dispose of it?
        </Typography>
        <Typography gutterBottom>
          Our bulk goods arrive in larger packaging than you would see on the
          shelf at your grocery store. Most of the dry goods are shipped in
          paper packaging that we either reuse within our warehouse or recycle
          properly at a local facility in Austin. The same goes for the liquids
          that arrive in plastic packaging. If we are not reusing it in the
          warehouse or sending it back to the distribution to reuse, we properly
          recycle it at a local center.
        </Typography>
        <Typography variant="h3" gutterBottom>
          How do you pack the bulk goods into the reusable jars?
        </Typography>
        <Typography gutterBottom>
          We have several ways of packing products in our warehouse! For our
          liquids, we have a machine that measures out the correct volume and
          fills the jars and bottles. For solids, we use two methods depending
          on the size/shape of the product. For example, for dried beans, nuts,
          rice, coffee, etc there is a machine that measures the correct weight
          for each product and fills the jar. But for snacks like Raw Bliss
          Balls and Pulp Chips, we pack those by hand to ensure they do not get
          crushed in the co-packing process.
        </Typography>
        <Typography>
          <Typography>
            As we mentioned before, our facility is not organic certified (yet!)
            so although we cannot label our products as 100% organic certified,
            you can rest easy knowing that we source the highest quality
            products and follow every food safety guideline to maintain the
            integrity of the product.
          </Typography>
        </Typography>
      </PageSection>
      <Box>
        <InternalWallyLink to="/">
          <Typography variant="h3" component="p">
            Start shopping sustainably.
          </Typography>
        </InternalWallyLink>
      </Box>
    </Page>
  );
}

export default observer(About);

function AboutPhoto() {
  return (
    <img
      src={about450}
      alt={'About page'}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
}
