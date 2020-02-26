import React, { Component } from 'react';
import Title from '../common/page/Title';
import ReactGA from 'react-ga';
import { connect, logEvent, logModalView, logPageView } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus()
      .then((status) => {
        // this.loadData()
      })
  }
  render() {
    return (
      <div className="App">
         <Title content="About" />

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h1>We are the sustainable grocery solution.</h1>
              <p className="text-center">
                The Wally Shop is changing up the grocery game with package-free deliveries that come straight to your door. While a trash-free trip to the store might seem impossible, The Wally Shop’s all reusable packaging and same-day delivery means ordering groceries can be sustainable and convenient. So you can spend more time doing what you love, and we’ll ensure you have local, organic, zero waste ingredients whenever you need them.
              </p>
            </div>  

            <div className="tagline howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
              <img alt="About page" src="images/about.jpg" />
            </div>

            <div className="row justify-content-between">
              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>It’s farmers market fresh - without the farmers market trip.</h1>
                  <p className="">
                  <b>“After managing the packaging and shipping category at Amazon, I became aware of just how much packaging we use on a daily basis.” - Tamara Lim, Founder</b>
                  </p>

                  <p>
                  After switching to a more sustainable lifestyle, founder Tamara Lim realized how difficult zero waste grocery shopping was with a busy schedule. With single-use plastic packaging at an all-time high, grocery stores were a barrier to her sustainable endeavors. That’s why she created The Wally Shop, which combines the convenience of delivery with the responsibility of package-free groceries. 
                  </p>

                  <p>
                  Buying groceries with The Wally Shop means you can guarantee that all ingredients were ethically purchased. We prioritize shopping at local farmers markets, supporting small businesses and choosing organic ingredients above all else. Want to find out more about where we shop? Click <a href="/help/topics/5b9157bc5e3b27043b178f8e">here</a>. 
                  </p>
                </div>  
              </div>

              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>Our Name</h1>
                  <p className="">
                  The name "The Wally Shop" was inspired by an incredible cooperative of individuals from India called the dabbawalla. Dubbed the world’s “best food delivery system”, they visit suburbs to pick up worker’s freshly made lunch tiffins - usually prepared by a wife - and deliver them to their respective husbands working in the city. After lunch, the tiffins are collected and returned. At The Wally Shop, our goal is similar: we offer same-day delivery and a completely closed loop system with exclusively reusable packaging. And by shopping at farmers markets and local stores for healthy, organic ingredients, The Wally Shop gives you a fresh take on package-free groceries.
                  </p>
                </div>  
              </div> 
            </div>
            <div className="tagline">
              <h2>Start your sustainable shopping <a href="/main">here</a>.</h2>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(About);
