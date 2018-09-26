import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.contentStore = this.props.store.content
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
      })
  }

  loadData() {
    this.contentStore.getBlogPost().then((data) => {
      console.log(data)
    })
  }

  render() {
    return (
      <div className="App">
         <Title content="Blog" />

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h1>We are the sustainable grocery solution.</h1>
              <p className="text-center">
                The Wally Shop is changing up the grocery game with package-free deliveries that come straight to your door. With the world’s massive waste problem, due in large part to our single-use habits, we want to make sustainability a priority. But switching to a package free life doesn’t have to be impossible: same-day grocery delivery from The Wally Shop makes sustainable shopping simple and convenient. So you can spend more time doing what you love, and we’ll ensure you have local, organic, zero waste groceries whenever you need them.
              </p>
            </div>  

            <div className="tagline">
              <img alt="About page" src="images/brocoli.png" />
            </div>

            <div className="row justify-content-between">
              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>It’s farmers market fresh - without the farmers market trip.</h1>
                  <p className="">
                  “After managing the packaging and shipping category at Amazon, I became aware of just how much packaging we use on a daily basis.” Tamara Lim, Founder 
                  </p>

                  <p>
                  Following her decision to live a more sustainable lifestyle, founder Tamara Lim realized how difficult zero waste grocery shopping was with a busy schedule. With single use plastic packaging at an all-time high, grocery stores were a barrier to her sustainable endeavors. That’s why she created The Wally Shop, which combines the convenience of delivery with the responsibility of package-free groceries. 
                  </p>

                  <p>
                  When you buy groceries through The Wally Shop, we can guarantee that all of our ingredients are ethically purchased. We prioritize shopping at local farmers markets, supporting small businesses and choosing organic ingredients above all else. Want to find out more? Click <a href="/help/topics/5b9157bc5e3b27043b178f8e">here</a>. 
                  </p>
                </div>  
              </div>

              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>Our Name</h1>
                  <p className="">
                  The name “The Wally Shop” was inspired by an incredible cooperative of individuals from India known as the dabbawala. Dubbed the world’s “best food delivery system”, they work in the Mumbai area to pick up worker’s freshly made lunch tiffins - usually prepared by a wife - and deliver them to their respective husbands working in the city. After lunch, the tiffins are collected and returned home.
                  </p>

                  <p>
                  At The Wally Shop, our goal is similar. We are a completely closed loop business - with the help of our exclusively reusable packaging - that you can rely on with for same-day delivery. Shopping at farmers markets and local stores for healthy, organic ingredients is how we give you a fresh take on package free groceries.
                  </p>
                </div>  
              </div> 
            </div>
            <div className="tagline">
              <h2>Start ordering package-free groceries <a href="/main">here</a>.</h2>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(About);
