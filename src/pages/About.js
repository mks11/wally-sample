import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
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
              <h1>Turn out grocery shopping is so much better without packaging</h1>
              <p className="text-center">
                The Wally Shop was founded with the singular mission to take make sustainable shopping the new standard. We believe in delightning people and our planet by offering great value, selection and convenience, all built upon a foundation that is inherently sustainable.
              </p>
            </div>  

            <div className="tagline">
              <img alt="About page" src="images/brocoli.png" />
            </div>

            <div className="row justify-content-between">
              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>What Doesn't kill us makes us stronger</h1>
                  <p className="">
                  We knew that if we wanted to make sustainability the new
                  standard, that meant we had to make sure we could offer 
                  the same if not better value, selection and convenience
                  that we are all accustomed to. 
                  </p>

                  <p>
                  What we found - building a business sustainability first 
                  can actually create an experience with even better value, 
                  selection and convenience.
                  </p>

                  <p>
                  By using only reusable packaging, it’s enabled us to source
                  higher quality packaging that actually keeps your produce
                  fresher from our warehouse to your doorstep. Sourcing local
                  organic produce, tastes that much better. 
                  </p>


                  <p>
                  Because we buy everything in bulk and package them in
                  house. We are able to pass on bulk prices to you at
                  personalized quantities. By sourcing local and organic
                  produce, reduces transportation costs.
                  </p>

                  <p>
                  And without all that single use plastic, we’ve found that our
                  unpacking experience is that much more rewarding and hassel
                  free. Plus our packaging is not just reusable, we think they 
                  look pretty good sitting on our shelves what do you think?
                  </p>

                </div>  
              </div>

              <div className="col-md-5 col-xs-12">
                <div className="tagline">
                  <h1>Better together</h1>
                  <p className="">
                  We understand that our mission to bring
                  forth a better way of doing things is no
                  easy feat. Lucky for us, we’re not alone,
                  thanks to you awesome people. 
                  </p>

                  <p>
                  If we are going to change the world, what
                  better chance do we have than to do it together.
                  </p>

                  <p>
                  We will be hosting town halls, selection 
                  tasting all that would directly affect our
                  choices as we grow. </p>

                  <p>
                  So if you are passionate about our shared 
                  mission and would love to partificpate, reach 
                  out to Molly at molly@thewallyshop.co.
                  </p>
                </div>  
              </div> 
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(About);
