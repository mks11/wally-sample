import React from 'react';

import orderHd450 from 'images/order-hd-450.jpg';
import orderHd600 from 'images/order-hd-600.jpg';

import toteHd450 from 'images/tote-hd-450.jpg';
import toteHd600 from 'images/tote-hd-600.jpg';

import returnPackagingHd450 from 'images/return-packaging-hd-450.jpg';
import returnPackagingHd600 from 'images/return-packaging-hd-600.jpg';

import { observer } from 'mobx-react';

import HowTo from './shared/HowTo';
import HowToPhoto from './shared/HowToPhoto';

import { Box, Typography } from '@material-ui/core';
import Page from './shared/Page';

function HowItWorks() {
  return (
    <Page
      title="How it Works"
      description="Learn about The Wally Shop service."
      content="Our Process"
    >
      <Box textAlign="center" maxWidth="720px" marginX="auto">
        <Typography variant="h2" gutterBottom>
          It's what's on the inside that counts.
        </Typography>
        <Typography gutterBottom>
          We are introducing a whole new way to shop sustainably. Our vision is
          to help you shop for everything (Bulk foods! Beauty products!
          Household products!) conveniently in all reusable packaging. We’re
          starting with responsibly-made, Trader Joe’s price-competitive bulk
          foods, but we will be expanding categories and on-boarding more brands
          in the coming weeks. We want to get you what you need, 100% waste
          free, so please reach out if you have any brands in mind ;)
        </Typography>
        <Typography gutterBottom>
          We hope you’re as ready as we are to join the #reusablesrevolution and
          change the world in dreamy purple ~ one order at a time.
          #wallydreamsinpurple
        </Typography>
      </Box>

      <HowTo
        title="Order"
        description="Choose from hundreds of responsibly-made, Trader Joe’s
                  price-competitive bulk foods. At checkout, you will be charged
                  a deposit for your packaging (don’t worry, you will be getting
                  it back!)."
        photo={
          <HowToPhoto
            src450={orderHd450}
            src600={orderHd600}
            alt="Man giving money in exchange for a jar of pasta."
          />
        }
      />

      <HowTo
        title="Receive"
        description="
                  Your order will arrive at your doorstep in completely
                  reusable, returnable packaging. The shipping tote it arrives
                  in folds up for easy storage. Simple, convenient, 100% waste
                  free shopping.
            "
        photoAlign="left"
        photo={
          <HowToPhoto
            src450={toteHd450}
            src600={toteHd600}
            alt="The Wally Shop's reusable tote."
          />
        }
      />

      <HowTo
        title="Return"
        description="
                Once finished, you can return all your packaging (jars, totes,
                anything we send to you, we take back and reuse) to a
                FedEx/UPS delivery courier on a future delivery or schedule a
                free pick-up on the website. Your deposit is credited back to
                you and the packaging is cleaned to be put back into
                circulation.
            "
        photo={
          <HowToPhoto
            src450={returnPackagingHd450}
            src600={returnPackagingHd600}
            alt="Returning an empty jar."
          />
        }
      />
    </Page>
  );
}

export default observer(HowItWorks);
