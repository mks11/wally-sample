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
      <div className="App align-items-center">
         <Title content="Our Process" />

         <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="tagline">
              <h2>It's what's on the inside that counts.</h2>
              <p></p>
              <p>Say goodbye to wasteful packaging with The Wally Shop. Order local, organic produce and we'll deliver it same-day from farmers markets and bulk stores. The best part? We deliver in all reusable packaging, which means no plastic. Ever. Return your packaging during a future delivery, and we'll clean and reuse it.</p>
              <p>You take care of the earth - we'll take care of the groceries.</p>
            </div>

            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Order</h1>
                  <p>Shop produce from local, organic farmers markets & shops</p>
                </div>
              </div>
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <img src="images/home6_hd.png" alt=""/>
              </div>
            </div>


            <div className="row d-flex justify-content-center align-items-center mt-5">
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6">
                <img src="images/home7_hd.png" alt=""/>
              </div>
              <div className="receive-item receive-div col-12 col-sm-10 col-md-8 col-lg-6 col-lg-offset-2 col-md-offset-2">
                <div className="receive-item w-75 pull-right">
                  <h1>Receive</h1>
                  <p className="receive-item">Get it delivered in all reusable packaging</p>
                </div>
              </div>
            </div>

            <div className="row d-flex mt-5 justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Return</h1>
                  <p>Return packaging at a future delivery for reuse</p>
                </div>
              </div>
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <img src="images/home8_hd.png" alt=""/>
              </div>
            </div>
          </div>

          <br /><br />
        </section>

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

            <div className="tagline howitworks">
              <img alt="How It Works" src="images/howitworks.jpg" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(HowItWorks);
