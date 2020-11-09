import React, { Component } from 'react';
import Title from '../common/page/Title';
import { logPageView } from 'services/google-analytics';
import { connect } from '../utils';

import Head from '../common/Head';
import about450 from 'images/about-450.jpg';
import about600 from 'images/about-600.jpg';

class About extends Component {
  constructor(props, context) {
    super(props, context);
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;
  }
  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
    this.userStore.getStatus().then((status) => {
      // this.loadData()
    });
  }
  render() {
    return (
      <div className="App">
        <Head
          title="About"
          description="Learn more about The Wally Shop's history and vision for a zero-waste future."
        />
        <Title content="About" />

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h1>
                We deliver your favorites from the brands you love, 100%
                waste-free.
              </h1>
              <p className="text-center">
                We are introducing a whole new way to shop sustainably. Our
                vision is to help you shop for everything (bulk foods! Beauty
                products! Household products!) in all reusable packaging
                conveniently and without sacrificing any value. We’re starting
                with responsibly-made, Trader Joe’s price-competitive bulk
                foods, but we will be expanding categories and on-boarding more
                brands in the coming weeks. We want to get you what you need,
                100% waste free, so please reach out if you have any products in
                mind ;)
              </p>
            </div>
            <AboutPhoto />
            <div className="row justify-content-between">
              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>Our Mission</h1>
                  <p>
                    You’ve seen the news, we’ve seen the news. We have a
                    climate- and waste- crisis that threatens all of us.
                    However, we definitely don’t believe in doom and gloom! We
                    believe that united, we control our future. We believe
                    people want to do good, given the choice and it’s on us help
                    make it more convenient.
                  </p>

                  <p>
                    That’s where we come in. Our mission is to help you get what
                    you need from your favorite brands, in all reusable,
                    returnable packaging for a 100% waste free shopping
                    experience. And while we are all cleaning up the world ~
                    we’re going to have fun while we are at it, in full purple
                    dreamy glow{' '}
                    <span role="img" aria-label="sparkle">
                      ✨
                    </span>
                  </p>
                </div>
              </div>

              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>Our History</h1>
                  <p className="">
                    The Wally Shop’s story starts with our founder, Tamara. Due
                    to fate, destiny, luck, whatever you want to call it, she
                    experienced first-hand two major trends of our generation:
                    the rise of Amazon and the plastic-waste crisis.
                  </p>

                  <p className="">
                    While working at Amazon, managing the packaging and shipping
                    category, she wanted to switch to a more sustainable
                    lifestyle. All the doom and gloom surrounding our
                    environment made her anxious about the future, especially
                    when thinking about the impact a single person could
                    possibly have. But she saw she wasn’t alone ~ there were
                    hundreds of thousands of us attending rallies, voicing our
                    concerns and showing our support for the planet. She
                    realized that if we could build an option that took the best
                    of what something like Amazon could offer - value,
                    selection, convenience - but in an inherently sustainably
                    way, it would be something for people to rally around and
                    feel powerful. Because everytime we choose the reusable
                    option over the disposable option, we have made a real,
                    positive impact. Together we can change the world, one order
                    at a time.
                  </p>
                </div>
              </div>
            </div>
            <div className="tagline">
              <h2>
                Start your sustainable shopping <a href="/">here</a>.
              </h2>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect('store')(About);

function AboutPhoto() {
  return (
    <div className="tagline howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
      <img
        srcSet={`${about450} 450w,
                   ${about600} 600w`}
        sizes="(max-width: 767px) 450px,
                  600px"
        src={about600}
        alt="About page"
      />
    </div>
  );
}
