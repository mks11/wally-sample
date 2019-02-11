import React, { Component } from 'react';
import Title from '../common/page/Title';
import ReactGA from 'react-ga';
import { connect, logEvent, logModalView, logPageView } from '../utils'

class HowItWorks extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }
  render() {
    return (
      <div className="App">
         <Title content="Our Process" />

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h1>How The Wally Shop works:</h1>
              <p className="">
                <ol>
                  <li><strong>Start shopping.</strong><br/> Create an account with us - right now, we’re only available in <a href="/help/detail/5c3d0df2fc84ff404f3b9eca">these select zip codes.</a> If you’re not in one of our neighborhoods, sign up to get notified on when we’re available in your area.<br/><br/></li>
                  <li><strong>Everything's in reusable packaging which we collect back for reuse.</strong><br/> All of our groceries come packaged in reusable packaging - think mesh bags, glass jars, and totes. Once finished, simply return the packaging to a courier on a future delivery and get your deposit back as store credit.<br/><br/></li>
                  <li><strong>Our produce are exclusively local, organic or fairtrade.</strong><br/> We proudly source from small local shops and farmers markets to ensure that all of the ingredients we offer are ethically-sourced and high quality. Everything is shopped for on the day of your delivery, so you can be sure it's as fresh as possible.<br/><br/></li>
                  <li><strong>Prices - no markup, ever.</strong><br/> The prices you pay are the prices you’d pay at the store or at the market. The charges we do include are: a service fee to compensate the great people who do your shopping and the team that makes this possible; a delivery fee to fairly pay our couriers that deliver via bike; and a packaging deposit that you get back when you return our packaging to us.<br/><br/></li>
                </ol>
              </p>
            </div>  
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(HowItWorks);
