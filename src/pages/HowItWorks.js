import React from 'react';

// Custom Components
import Page from 'templates/Page';
import PageSection from 'common/PageSection';

// Material UI
import { Typography } from '@material-ui/core';

export default function HowItWorks() {
  return (
    <Page
      title="How it Works"
      description="Learn about The Wally Shop service."
      content="Our Process"
    >
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
    </Page>
  );
}
